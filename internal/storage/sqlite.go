package storage

import (
	"database/sql"
	"errors"
	"io/ioutil"
	"os"
	"time"

	_ "modernc.org/sqlite"

	"github.com/google/uuid"
)

// InitSQLite 打开 SQLite 并执行迁移
func InitSQLite(path string) (*sql.DB, error) {
	db, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, err
	}

	// 设置合理的忙碌超时
	_, _ = db.Exec("PRAGMA busy_timeout = 5000;")

	if err := migrate(db); err != nil {
		return nil, err
	}
	return db, nil
}

func migrate(db *sql.DB) error {
	// admin_tokens表
	_, err := db.Exec(`
	CREATE TABLE IF NOT EXISTS admin_tokens (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		token TEXT NOT NULL UNIQUE,
		created_at DATETIME NOT NULL
	);
	`)
	if err != nil {
		return err
	}

	// 公告表
	_, err = db.Exec(`
	CREATE TABLE IF NOT EXISTS announcements (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		content TEXT NOT NULL,
		created_at DATETIME NOT NULL
	);
	`)
	return err
}

// EnsureAdminToken: 如果令牌文件存在，请读取它并确保它在数据库中。
// 如果不存在，则生成一个 uuid，写入文件并插入数据库。
// 返回令牌字符串。
func EnsureAdminToken(db *sql.DB, tokenPath string) (string, error) {
	// If token file exists -> read
	if _, err := os.Stat(tokenPath); err == nil {
		b, err := ioutil.ReadFile(tokenPath)
		if err != nil {
			return "", err
		}
		token := string(b)
		// 确保在数据库中
		if exists, _ := adminTokenExists(db, token); !exists {
			if err := insertAdminToken(db, token); err != nil {
				return "", err
			}
		}
		return token, nil
	}

	// 生成新的
	newUUID := uuid.New().String()
	if err := ioutil.WriteFile(tokenPath, []byte(newUUID), 0640); err != nil {
		return "", err
	}
	if err := insertAdminToken(db, newUUID); err != nil {
		return "", err
	}
	return newUUID, nil
}

func adminTokenExists(db *sql.DB, token string) (bool, error) {
	var id int
	err := db.QueryRow("SELECT id FROM admin_tokens WHERE token = ? LIMIT 1", token).Scan(&id)
	if err == sql.ErrNoRows {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return id > 0, nil
}

func insertAdminToken(db *sql.DB, token string) error {
	if token == "" {
		return errors.New("empty token")
	}
	_, err := db.Exec("INSERT OR IGNORE INTO admin_tokens (token, created_at) VALUES (?, ?)", token, time.Now().UTC())
	return err
}
