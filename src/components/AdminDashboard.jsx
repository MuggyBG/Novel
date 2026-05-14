import React, { useState, useEffect, useRef } from "react";
import {
    Container,
    Typography,
    Box,
    TextField,
    Button,
    Paper,
    Stack,
    Snackbar,
    Alert,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    Divider,
} from "@mui/material";
import { sanitizeContentForJSON, isContentJSONSafe } from "../utils/encodingHelpers";

const AdminDashboard = () => {
    const [novels, setNovels] = useState([]);
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [activeTab, setActiveTab] = useState("novel");

    const [newNovel, setNewNovel] = useState({
        title: "",
        author: "",
        synopsis: "",
        coverImg: "",
        genres: "",
        status: "Ongoing",
    });
    const [newChapter, setNewChapter] = useState({
        novelId: "",
        chapterNumber: "",
        title: "",
        content: "",
    });

    const [showUndo, setShowUndo] = useState(false);
    const [deletedNovelBackup, setDeletedNovelBackup] = useState(null);
    const deleteTimeoutRef = useRef(null);

    useEffect(() => {
        fetch("http://localhost:5174/novels")
            .then((res) => res.json())
            .then((data) => setNovels(data.data ? data.data : data));
    }, []);

    const handleNovelSubmit = async (e) => {
        e.preventDefault();

        const generateId = () => {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
            let result = '';
            for (let i = 0; i < 12; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        };

        const existingNovelIDs = novels.map(novel => parseInt(novel.novelID)).filter(id => !isNaN(id)).sort((a, b) => a - b);
        let nextNovelID = 100000;
        for (let i = 0; i < existingNovelIDs.length; i++) {
            if (existingNovelIDs[i] === nextNovelID) {
                nextNovelID++;
            } else if (existingNovelIDs[i] > nextNovelID) {
                break;
            }
        }

        const novelPayload = {
            id: generateId(),
            novelID: nextNovelID.toString(),
            ...newNovel,
            author:
                newNovel.author.trim() === "" ? "Unknown" : newNovel.author.trim(),
            genres: newNovel.genres
                ? newNovel.genres.split(",").map((g) => g.trim())
                : [],
        };
        console.log(novelPayload)

        try {
            const res = await fetch("http://localhost:5174/novels", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novelPayload),
            });
            if (res.ok) {
                setToast({
                    open: true,
                    message: "Novel Added Successfully!",
                    severity: "success",
                });
                setNewNovel({
                    title: "",
                    author: "",
                    synopsis: "",
                    coverImg: "",
                    genres: "",
                    status: "Ongoing",
                });
                fetch("http://localhost:5174/novels")
                    .then((r) => r.json())
                    .then((d) => setNovels(d.data ? d.data : d));
            }
        } catch (err) {
            setToast({
                open: true,
                message: "Error adding novel",
                severity: "error",
            });
        }
    };

    const initiateDelete = async (novel) => {
        setNovels((prev) => prev.filter((n) => n.id !== novel.id));
        setDeletedNovelBackup(novel);
        setShowUndo(true);

        try {
            await fetch(`http://localhost:5174/novels/${novel.id}`, {
                method: "DELETE",
            });
            const currentContinueReading = JSON.parse(localStorage.getItem('continueReading')) || [];
            const updatedContinueReading = currentContinueReading.filter(
                (n) => String(n.novelID) !== String(novel.id)
            );
            localStorage.setItem('continueReading', JSON.stringify(updatedContinueReading));

                        const savedLibraryRaw = JSON.parse(localStorage.getItem('savedLibrary')) || [];
                        if (Array.isArray(savedLibraryRaw)) {
                            const updatedLibrary = savedLibraryRaw.filter(
                                (n) => String(n.novelID) !== String(novel.id)
                            );
                            localStorage.setItem('savedLibrary', JSON.stringify(updatedLibrary));
                        } else {
                            const updatedLibrary = {};
                            Object.entries(savedLibraryRaw).forEach(([key, library]) => {
                                updatedLibrary[key] = Array.isArray(library)
                                    ? library.filter((n) => String(n.novelID) !== String(novel.id))
                                    : library;
                            });
                            localStorage.setItem('savedLibrary', JSON.stringify(updatedLibrary));
                        }
        } catch (err) {
            setToast({
                open: true,
                message: "Failed to delete novel from database.",
                severity: "error",
            });
        }

        if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
        deleteTimeoutRef.current = setTimeout(() => {
            setShowUndo(false);
            setDeletedNovelBackup(null);
        }, 5000);
    };

    const handleUndo = async () => {
        if (!deletedNovelBackup) return;
        if (deleteTimeoutRef.current) clearTimeout(deleteTimeoutRef.current);
        setShowUndo(false);
        
        setNovels((prev) => {
            const restoredList = [...prev, deletedNovelBackup];
            return restoredList.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        });

        try {
            await fetch('http://localhost:5174/novels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(deletedNovelBackup)
            });
        } catch (err) {
            setToast({ open: true, message: 'Failed to restore novel to database.', severity: 'error' });
        }

        setDeletedNovelBackup(null);
    };

    const handleChapterSubmit = async (e) => {
        e.preventDefault();
        if (!newChapter.novelId) {
            setToast({
                open: true,
                message: "Please select a novel first!",
                severity: "warning",
            });
            return;
        }

        const formattedTitle = newChapter.title.trim()
            ? `Chapter ${newChapter.chapterNumber} - ${newChapter.title.trim()}`
            : `Chapter ${newChapter.chapterNumber}`;

        const contentString = sanitizeContentForJSON(newChapter.content);
        if (!isContentJSONSafe(contentString)) {
            setToast({
                open: true,
                message: "Chapter content contains invalid characters. Please review and try again.",
                severity: "error",
            });
            return;
        }

        const chapterPayload = {
            id: `${newChapter.novelId}${newChapter.chapterNumber}`,
            novelID: String(newChapter.novelId),
            chapterNumber: parseInt(newChapter.chapterNumber),
            title: formattedTitle,
            content: contentString,
        };

        try {
            const res = await fetch("http://localhost:5174/chapters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(chapterPayload),
            });
            if (res.ok) {
                setToast({
                    open: true,
                    message: "Chapter Added Successfully!",
                    severity: "success",
                });
                setNewChapter({
                    ...newChapter,
                    chapterNumber: "",
                    title: "",
                    content: "",
                });
            }
        } catch (err) {
            setToast({
                open: true,
                message: "Error adding chapter",
                severity: "error",
            });
        }
    };

    const handleMassUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !newChapter.novelId) {
            setToast({
                open: true,
                message: "Select a novel and a JSON file!",
                severity: "error",
            });
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const json = JSON.parse(event.target.result);
                if (!Array.isArray(json)) throw new Error("JSON must be an array");

                for (const item of json) {
                    const formattedTitle = item.title
                        ? `Chapter ${item.chapterNumber} - ${item.title}`
                        : `Chapter ${item.chapterNumber}`;

                    const contentString = sanitizeContentForJSON(item.content);

                    await fetch("http://localhost:5174/chapters", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            id: `${newChapter.novelId}${item.chapterNumber}`,
                            novelID: String(newChapter.novelId),
                            chapterNumber: item.chapterNumber,
                            title: formattedTitle,
                            content: contentString,
                        }),
                    });
                }
                setToast({
                    open: true,
                    message: `Successfully uploaded ${json.length} chapters!`,
                    severity: "success",
                });
            } catch (err) {
                setToast({
                    open: true,
                    message: "Invalid JSON file format.",
                    severity: "error",
                });
            }
        };
        reader.readAsText(file);
    };

    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 10 }}>
            <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                color="text.primary"
            >
                Admin Panel
            </Typography>

            <Box display="flex" gap={2} mb={4}>
                <Button
                    variant={activeTab === "novel" ? "contained" : "outlined"}
                    onClick={() => setActiveTab("novel")}
                >
                    Add Novel
                </Button>
                <Button
                    variant={activeTab === "chapter" ? "contained" : "outlined"}
                    onClick={() => setActiveTab("chapter")}
                >
                    Add Chapter
                </Button>
                <Button
                    variant={activeTab === "mass" ? "contained" : "outlined"}
                    onClick={() => setActiveTab("mass")}
                >
                    Mass Upload
                </Button>
                <Button
                    variant={activeTab === "manage" ? "contained" : "outlined"}
                    color="secondary"
                    onClick={() => setActiveTab("manage")}
                >
                    Manage
                </Button>
            </Box>

            {activeTab === "novel" && (
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" mb={4} color="primary" fontWeight="bold">
                        Upload a New Novel
                    </Typography>
                    <Box component="form" onSubmit={handleNovelSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                required
                                label="Novel Title"
                                inputProps={{ maxLength: 200 }}
                                value={newNovel.title}
                                onChange={(e) =>
                                    setNewNovel({ ...newNovel, title: e.target.value })
                                }
                            />
                            <TextField
                                fullWidth
                                label="Author"
                                value={newNovel.author}
                                onChange={(e) =>
                                    setNewNovel({ ...newNovel, author: e.target.value })
                                }
                            />
                            <TextField
                                fullWidth
                                required
                                label="Genres (comma separated)"
                                placeholder="Action, Fantasy"
                                value={newNovel.genres}
                                onChange={(e) =>
                                    setNewNovel({ ...newNovel, genres: e.target.value })
                                }
                            />
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                value={newNovel.status}
                                onChange={(e) =>
                                    setNewNovel({ ...newNovel, status: e.target.value })
                                }
                            >
                                <MenuItem value="Ongoing">Ongoing</MenuItem>
                                <MenuItem value="Completed">Completed</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                label="Cover Image URL"
                                value={newNovel.coverImg}
                                onChange={(e) =>
                                    setNewNovel({ ...newNovel, coverImg: e.target.value })
                                }
                            />
                            <TextField
                                fullWidth
                                required
                                multiline
                                rows={4}
                                label="Synopsis"
                                value={newNovel.synopsis}
                                onChange={(e) =>
                                    setNewNovel({ ...newNovel, synopsis: e.target.value })
                                }
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                sx={{ py: 2, mt: 2 }}
                            >
                                Publish Novel
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            )}

            {activeTab === "chapter" && (
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" mb={4} color="primary" fontWeight="bold">
                        Upload a New Chapter
                    </Typography>
                    <Box component="form" onSubmit={handleChapterSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                fullWidth
                                select
                                required
                                label="Select Novel"
                                value={newChapter.novelId}
                                onChange={(e) =>
                                    setNewChapter({ ...newChapter, novelId: e.target.value })
                                }
                                SelectProps={{
                                    MenuProps: { PaperProps: { sx: { maxHeight: 300 } } },
                                }}
                            >
                                {novels.map((novel) => (
                                    <MenuItem key={novel.novelID} value={novel.novelID}>
                                        {novel.title}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                fullWidth
                                required
                                type="number"
                                label="Chapter Number"
                                value={newChapter.chapterNumber}
                                onChange={(e) =>
                                    setNewChapter({
                                        ...newChapter,
                                        chapterNumber: e.target.value,
                                    })
                                }
                            />
                            <TextField
                                fullWidth
                                label="Chapter Title"
                                placeholder="e.g. Rebirth"
                                value={newChapter.title}
                                onChange={(e) =>
                                    setNewChapter({ ...newChapter, title: e.target.value })
                                }
                            />
                            <TextField
                                fullWidth
                                required
                                multiline
                                rows={12}
                                label="Chapter Content"
                                value={newChapter.content}
                                onChange={(e) =>
                                    setNewChapter({ ...newChapter, content: e.target.value })
                                }
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                fullWidth
                                sx={{ py: 2, mt: 2 }}
                            >
                                Publish Chapter
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            )}

            {activeTab === "mass" && (
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" mb={4} color="primary" fontWeight="bold">
                        Mass Chapter Upload
                    </Typography>
                    <Stack spacing={4}>
                        <TextField
                            fullWidth
                            select
                            required
                            label="Select Novel to Target"
                            value={newChapter.novelId}
                            onChange={(e) =>
                                setNewChapter({ ...newChapter, novelId: e.target.value })
                            }
                        >
                            {novels.map((novel) => (
                                <MenuItem key={novel.id} value={novel.id}>
                                    {novel.title}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Box
                            sx={{
                                p: 3,
                                border: "2px dashed #ccc",
                                textAlign: "center",
                                borderRadius: 2,
                            }}
                        >
                            <Typography variant="body1" mb={2}>
                                Upload your JSON file containing an array of chapters
                            </Typography>
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleMassUpload}
                                style={{ display: "block", margin: "0 auto" }}
                            />
                        </Box>
                        <Alert severity="info">
                            Ensure your JSON keys are: "chapterNumber", "title", and
                            "content".
                        </Alert>
                    </Stack>
                </Paper>
            )}

            {activeTab === "manage" && (
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" mb={4} color="primary" fontWeight="bold">
                        Manage Novels
                    </Typography>
                    <List>
                        {novels.length === 0 ? (
                            <Typography color="text.secondary">No novels found.</Typography>
                        ) : (
                            novels.map((novel) => (
                                <React.Fragment key={novel.id}>
                                    <ListItem
                                        secondaryAction={
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => initiateDelete(novel)}
                                            >
                                                Delete
                                            </Button>
                                        }
                                    >
                                        <ListItemText
                                            primary={`[ID: ${novel.id}] ${novel.title}`}
                                            secondary={`Author: ${novel.author} • Status: ${novel.status}`}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))
                        )}
                    </List>
                </Paper>
            )}

            <Snackbar
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast({ ...toast, open: false })}
            >
                <Alert severity={toast.severity}>{toast.message}</Alert>
            </Snackbar>

            <Snackbar
                open={showUndo}
                autoHideDuration={5000} 
                onClose={(event, reason) => {
                    if (reason === "clickaway") return; 
                    setShowUndo(false);
                }}
                message={`Deleted "${deletedNovelBackup?.title}"`}
                action={
                    <Button
                        color="secondary"
                        size="small"
                        onClick={handleUndo}
                        sx={{ fontWeight: "bold" }}
                    >
                        UNDO
                    </Button>
                }
            />
        </Container>
    );
};

export default AdminDashboard;
