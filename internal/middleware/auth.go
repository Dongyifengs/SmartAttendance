package middleware

import (
	"database/sql"
	"net/http"
)

func AdminAuthMiddleware(db *sql.DB) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		fn := func(w http.ResponseWriter, r *http.Request) {
			token := r.Header.Get("X-Admin-Token")
			if token == "" {
				http.Error(w, "缺少管理员令牌", http.StatusUnauthorized)
				return
			}
			var id int
			err := db.QueryRow("SELECT id FROM admin_tokens WHERE token = ? LIMIT 1", token).Scan(&id)
			if err != nil || id == 0 {
				http.Error(w, "无效的管理员令牌", http.StatusUnauthorized)
				return
			}
			next.ServeHTTP(w, r)
		}
		return http.HandlerFunc(fn)
	}
}
