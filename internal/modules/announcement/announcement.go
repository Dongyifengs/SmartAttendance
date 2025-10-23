package announcement

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"
	"time"
)

type Announcement struct {
	ID        int       `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

func RegisterRoutes(mux *http.ServeMux, db *sql.DB, adminMiddleware func(http.Handler) http.Handler) {
	// 管理员 POST 创建公告
	mux.Handle("/admin/announcements", adminMiddleware(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			handleCreateAnnouncement(w, r, db)
			return
		}
		if r.Method == http.MethodGet {
			handleListAnnouncements(w, r, db)
			return
		}
		http.Error(w, "方法不允许", http.StatusMethodNotAllowed)
	})))

	// 用户 GET 列表公告
	mux.HandleFunc("/user/announcements", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodGet {
			http.Error(w, "方法不允许", http.StatusMethodNotAllowed)
			return
		}
		handleListAnnouncements(w, r, db)
	})
}

type createAnnouncementReq struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

func handleCreateAnnouncement(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	var req createAnnouncementReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "错误请求：JSON 无效", http.StatusBadRequest)
		return
	}
	if req.Title == "" || req.Content == "" {
		http.Error(w, "需要标题和内容", http.StatusBadRequest)
		return
	}
	now := time.Now().UTC()
	res, err := db.Exec("INSERT INTO announcements (title, content, created_at) VALUES (?, ?, ?)", req.Title, req.Content, now)
	if err != nil {
		http.Error(w, "插入失败", http.StatusInternalServerError)
		return
	}
	id64, _ := res.LastInsertId()
	ann := Announcement{
		ID:        int(id64),
		Title:     req.Title,
		Content:   req.Content,
		CreatedAt: now,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(ann)
}

func handleListAnnouncements(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	// Optional: support ?limit= and ?since_id=
	q := r.URL.Query()
	limit := 100
	if l := q.Get("limit"); l != "" {
		if v, err := strconv.Atoi(l); err == nil && v > 0 && v <= 1000 {
			limit = v
		}
	}
	rows, err := db.Query("SELECT id, title, content, created_at FROM announcements ORDER BY created_at DESC LIMIT ?", limit)
	if err != nil {
		http.Error(w, "数据库错误", http.StatusInternalServerError)
		return
	}
	defer rows.Close()
	out := make([]Announcement, 0)
	for rows.Next() {
		var a Announcement
		var created string
		if err := rows.Scan(&a.ID, &a.Title, &a.Content, &created); err != nil {
			http.Error(w, "数据库扫描错误", http.StatusInternalServerError)
			return
		}
		a.CreatedAt, _ = time.Parse(time.RFC3339Nano, created)
		out = append(out, a)
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(out)
}
