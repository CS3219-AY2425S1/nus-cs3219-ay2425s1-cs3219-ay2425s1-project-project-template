package utils

import "time"

// Store maps user IDs to their associated timers
var Store = make(map[int]*time.Timer)
