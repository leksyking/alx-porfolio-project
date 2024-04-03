package server

import (
	"log"
	"math/rand"
	"sync"

	"github.com/gorilla/websocket"
)

type Participant struct {
	Host bool
	Conn *websocket.Conn
}

// The hashmap
type RoomMap struct {
	Mutex sync.RWMutex
	Map map[string][]Participant
}

// Init Initialize the RoomMap
func (r *RoomMap) Init() {
	r.Map = make(map[string][]Participant)
}

// Get: Return array of participants in the room
func (r *RoomMap) Get(roomID string) []Participant {
	r.Mutex.RLock()
	defer r.Mutex.RUnlock()
	return r.Map[roomID]	
}

// CreateRoom: Create a new room;  generate a unique ID and insert it in the hashMap
func (r *RoomMap) CreateRoom() string {
	r.Mutex.Lock()
	defer r.Mutex.Unlock()

	letters := []rune("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ1234567890")
	arrange := make([]rune, 8)

	for i, _:= range arrange {
		arrange[i] = letters[rand.Intn(len(letters))]
	}

	roomID := string(arrange)
	r.Map[roomID] = []Participant{}

	return roomID
}

// InsertIntoRoom: create a participant and add into the hashMap
func (r *RoomMap) InsertIntoRoom(roomID string, host bool, conn *websocket.Conn) {
	participant := Participant{host, conn}

	log.Println("Inserting into room, RoomID: ", roomID)
	r.Map[roomID] = append(r.Map[roomID], participant)
}

// DeleteRoom: deletes the room with the roomID
func (r *RoomMap) DeleteRoom(roomID string) {
	r.Mutex.Lock()
	defer r.Mutex.RUnlock()
	delete(r.Map, roomID)
}

