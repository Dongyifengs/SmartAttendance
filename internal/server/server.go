package server

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"time"

	_ "modernc.org/sqlite"

	"SmartAttendance/internal/middleware"
	announcement "SmartAttendance/internal/modules/announcement"
	"SmartAttendance/internal/storage"
)

// Server 保存服务器依赖项
type Server struct {
	db         *sql.DB
	adminToken string
	mux        *http.ServeMux
}

// NewServer 初始化 DB、token 和模块
// dbPath：sqlite 文件的路径
// TokenPath：Admin.token 文件的路径
func NewServer(dbPath, tokenPath string) (*Server, error) {
	db, err := storage.InitSQLite(dbPath)
	if err != nil {
		return nil, err
	}

	adminToken, err := storage.EnsureAdminToken(db, tokenPath)
	if err != nil {
		return nil, err
	}

	s := &Server{
		db:         db,
		adminToken: adminToken,
		mux:        http.NewServeMux(),
	}

	// 运行状况终结点
	s.mux.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		type resp struct {
			Status    string    `json:"status"`
			Timestamp time.Time `json:"timestamp"`
		}
		json.NewEncoder(w).Encode(resp{Status: "ok", Timestamp: time.Now().UTC()})
	})

	// 寄存器模块
	// 公告模块在 /admin/...和 /user/...
	announcement.RegisterRoutes(s.mux, db, middleware.AdminAuthMiddleware(db))

	return s, nil
}

// Run 在 addr 上启动 HTTP 服务器
func (s *Server) Run(addr string) error {
	// Wrap mux with logging
	h := s.loggingMiddleware(s.mux)
	srv := &http.Server{
		Addr:         addr,
		Handler:      h,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
	}
	return srv.ListenAndServe()
}

func (s *Server) loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		log.Printf("[%s] %s %s in %s", r.RemoteAddr, r.Method, r.URL.Path, time.Since(start))
	})
}
