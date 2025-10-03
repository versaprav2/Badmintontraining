import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Plus, Trophy, TrendingDown } from "lucide-react";
import { toast } from "sonner";

interface Match {
  id: string;
  opponent: string;
  playerScore: number;
  opponentScore: number;
  result: "win" | "loss";
  date: string;
  notes: string;
}

export const MatchTracker = () => {
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem("matches");
    return saved ? JSON.parse(saved) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [opponent, setOpponent] = useState("");
  const [playerScore, setPlayerScore] = useState("");
  const [opponentScore, setOpponentScore] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!opponent || !playerScore || !opponentScore || !matchDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    const pScore = parseInt(playerScore);
    const oScore = parseInt(opponentScore);

    const newMatch: Match = {
      id: Date.now().toString(),
      opponent,
      playerScore: pScore,
      opponentScore: oScore,
      result: pScore > oScore ? "win" : "loss",
      date: matchDate,
      notes: notes,
    };

    const updatedMatches = [newMatch, ...matches];
    setMatches(updatedMatches);
    localStorage.setItem("matches", JSON.stringify(updatedMatches));
    toast.success("Match logged successfully!");

    // Reset form
    setOpponent("");
    setPlayerScore("");
    setOpponentScore("");
    setMatchDate("");
    setNotes("");
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Match Tracker</h2>
          <p className="text-muted-foreground">Log and review your matches</p>
        </div>
        <Button
          variant="gradient"
          size="lg"
          onClick={() => setShowForm(!showForm)}
          className="gap-2"
        >
          <Plus className="w-5 h-5" />
          Log Match
        </Button>
      </div>

      {showForm && (
        <Card className="p-6 border-2 border-primary/20">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="opponent">Opponent Name</Label>
                <Input
                  id="opponent"
                  value={opponent}
                  onChange={(e) => setOpponent(e.target.value)}
                  placeholder="Enter opponent name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Match Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={matchDate}
                  onChange={(e) => setMatchDate(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="playerScore">Your Score</Label>
                <Input
                  id="playerScore"
                  type="number"
                  min="0"
                  value={playerScore}
                  onChange={(e) => setPlayerScore(e.target.value)}
                  placeholder="21"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="opponentScore">Opponent Score</Label>
                <Input
                  id="opponentScore"
                  type="number"
                  min="0"
                  value={opponentScore}
                  onChange={(e) => setOpponentScore(e.target.value)}
                  placeholder="18"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about the match..."
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="default" size="lg">
                Save Match
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {matches.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground text-lg">No matches logged yet. Click "Log Match" to get started!</p>
          </Card>
        ) : (
          matches.map((match) => (
            <Card
              key={match.id}
              className={`p-6 border-2 transition-all duration-300 hover:shadow-lg ${
                match.result === "win"
                  ? "border-primary/30 bg-primary/5"
                  : "border-destructive/30 bg-destructive/5"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {match.result === "win" ? (
                    <div className="p-2 bg-primary/20 rounded-lg">
                      <Trophy className="w-6 h-6 text-primary" />
                    </div>
                  ) : (
                    <div className="p-2 bg-destructive/20 rounded-lg">
                      <TrendingDown className="w-6 h-6 text-destructive" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold">vs. {match.opponent}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {new Date(match.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <span
                  className={`px-4 py-1 rounded-full text-sm font-semibold ${
                    match.result === "win"
                      ? "bg-primary/20 text-primary"
                      : "bg-destructive/20 text-destructive"
                  }`}
                >
                  {match.result === "win" ? "Victory" : "Defeat"}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your Score</p>
                  <p className="text-2xl font-bold">{match.playerScore}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Opponent Score</p>
                  <p className="text-2xl font-bold">{match.opponentScore}</p>
                </div>
              </div>

              {match.notes && (
                <div className="pt-3 border-t">
                  <p className="text-sm text-muted-foreground">{match.notes}</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
