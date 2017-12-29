package main

import (
	"fmt"
	"log"
	"net/http"
)

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	urlTemplate := "http://bfwechat.beautyfarm.com.cn:8009/?productId=1&channelcode=%s"
	url := fmt.Sprintf(urlTemplate, r.FormValue("channelcode"))
	http.Redirect(w, r, url, http.StatusFound)
}

func main() {
	http.HandleFunc("/", IndexHandler)
	err := http.ListenAndServe(":8009", nil)
	if err != nil {
		log.Fatal(" ListenAndServe: ", err.Error())
	}
}
