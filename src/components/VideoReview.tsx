import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Upload, Video, Calendar, Clock, User, AlertCircle, Play, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/useLanguage";

interface VideoEntry {
  id: string;
  fileName: string;
  uploadDate: string;
  opponent: string;
  matchDate: string;
  notes: string;
  duration: string;
}

export const VideoReview = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [videos, setVideos] = useState<VideoEntry[]>([
    {
      id: "1",
      fileName: "match_vs_john_2024.mp4",
      uploadDate: "2024-03-15",
      opponent: "John Smith",
      matchDate: "2024-03-14",
      notes: "Strong backhand, need to work on net play",
      duration: "45:30"
    }
  ]);
  const [opponent, setOpponent] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check if it's a video file
      if (file.type.startsWith('video/')) {
        setSelectedFile(file);
        toast({
          title: "Video selected",
          description: `${file.name} ready to upload`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select a video file",
          variant: "destructive",
        });
      }
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !opponent || !matchDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Since Lovable Cloud is disabled, we'll show a message
    toast({
      title: "Cloud Storage Required",
      description: "Enable Lovable Cloud to store and analyze match videos",
      variant: "destructive",
    });

    // Simulate adding to list (won't persist without backend)
    const newVideo: VideoEntry = {
      id: Date.now().toString(),
      fileName: selectedFile.name,
      uploadDate: new Date().toISOString().split('T')[0],
      opponent,
      matchDate,
      notes,
      duration: "Unknown"
    };

    setVideos([newVideo, ...videos]);
    
    // Reset form
    setSelectedFile(null);
    setOpponent("");
    setMatchDate("");
    setNotes("");
  };

  const handleDelete = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
    toast({
      title: "Video removed",
      description: "Video entry has been deleted",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold mb-2">{t("video.title")}</h2>
        <p className="text-muted-foreground">{t("video.subtitle")}</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {t("video.alert")}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>{t("video.upload.title")}</CardTitle>
          <CardDescription>
            {t("video.upload.desc")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-upload">{t("video.upload.file")}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="video-upload"
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="flex-1"
              />
              {selectedFile && (
                <Badge variant="secondary" className="whitespace-nowrap">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </Badge>
              )}
            </div>
            {selectedFile && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Video className="h-4 w-4" />
                {selectedFile.name}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="opponent">{t("video.upload.opponent")}</Label>
              <Input
                id="opponent"
                placeholder={t("video.upload.opponentPlaceholder")}
                value={opponent}
                onChange={(e) => setOpponent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="match-date">{t("video.upload.matchDate")}</Label>
              <Input
                id="match-date"
                type="date"
                value={matchDate}
                onChange={(e) => setMatchDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">{t("video.upload.notes")}</Label>
            <Textarea
              id="notes"
              placeholder={t("video.upload.notesPlaceholder")}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            onClick={handleUpload} 
            className="w-full"
            disabled={!selectedFile || !opponent || !matchDate}
          >
            <Upload className="mr-2 h-4 w-4" />
            {t("video.upload.button")}
          </Button>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-xl font-semibold mb-4">{t("video.list.title")}</h3>
        <div className="grid gap-4">
          {videos.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Video className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">{t("video.list.empty")}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("video.list.emptyDesc")}
                </p>
              </CardContent>
            </Card>
          ) : (
            videos.map((video) => (
              <Card key={video.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Video className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2 flex-1">
                        <h4 className="font-semibold">{video.fileName}</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{t("video.vs")} {video.opponent}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{video.matchDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{video.duration}</span>
                          </div>
                        </div>
                        {video.notes && (
                          <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                            {video.notes}
                          </p>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" variant="outline">
                            <Play className="mr-2 h-4 w-4" />
                            {t("video.list.watch")}
                          </Button>
                          <Button size="sm" variant="outline">
                            {t("video.list.analysis")}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleDelete(video.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
