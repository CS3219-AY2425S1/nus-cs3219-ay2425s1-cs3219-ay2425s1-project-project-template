package processes

import (
	"context"
	"matching-service/models"
	"time"
)

// PerformMatching reads the match request and simulates a matching process.
func PerformMatching(matchRequest models.MatchRequest, ctx context.Context, matchFoundChan chan models.MatchFound) {
	defer close(matchFoundChan) // Safely close the channel after matching completes.

	// TODO: matching algorithm
	// for {
	// 	select {
	// 	case <-ctx.Done():
	// 		// The context has been cancelled, so stop the matching process.
	// 		return
	// 	default:
	// 		// Continue matching logic...
	// 	}
	// }
	// Simulate the matching process with a sleep (replace with actual logic).
	time.Sleep(2 * time.Second)

	// Create a mock result and send it to the channel.
	result := models.MatchFound{
		Type:        "match_found",
		MatchID:     67890,
		PartnerID:   54321,
		PartnerName: "John Doe",
	}

	matchFoundChan <- result
}
