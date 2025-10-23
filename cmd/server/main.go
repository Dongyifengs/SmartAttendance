package main

import (
	"log"
	"os"
	"runtime"

	"SmartAttendance/internal/server"
)

func main() {
	// 使用所有 CPU 内核
	runtime.GOMAXPROCS(runtime.NumCPU())

	// 确保数据目录存在
	if _, err := os.Stat("data"); os.IsNotExist(err) {
		if err := os.Mkdir("data", 0750); err != nil {
			log.Fatalf("无法创建数据目录: %v", err)
		}
	}

	srv, err := server.NewServer("data/app.db", "data/admin.token")
	if err != nil {
		log.Fatalf("无法初始化服务器: %v", err)
	}

	log.Println("启动服务器 - 127.0.0.1:8080")
	if err := srv.Run(":8080"); err != nil {
		log.Fatalf("服务器失败: %v", err)
	}
}
