import { useState } from 'react';
import { AppBar, Toolbar, Typography, TextField, Button, Card, CardContent, IconButton, Chip, Snackbar, Alert, InputAdornment, Select, MenuItem, FormControl, InputLabel, Tabs, Tab, Box, Rating, Dialog, DialogTitle, DialogContent } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

// 書籍データの型定義
interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  status: '未読' | '読了';
  rating: number;
}

export default function App() {
  // 入力フォームの状態
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('小説');
  const [rating, setRating] = useState<number | null>(3);

  // タブの状態 (0: すべて, 1: 未読, 2: 読了)
  const [tabValue, setTabValue] = useState(0);

  // 検索キーワードの状態
  const [searchQuery, setSearchQuery] = useState('');

  // 登録された書籍一覧の状態
  const [books, setBooks] = useState<Book[]>([]);

  // ダイアログ用の状態
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  // Snackbar（通知）の状態
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // 「追加」ボタンが押された時の処理
  const handleAddBook = () => {
    if (!title.trim()) return;

    const newBook: Book = {
      id: Date.now(),
      title: title,
      author: author || '著者不明',
      category: category,
      status: '未読',
      rating: rating || 0,
    };

    setBooks([...books, newBook]);
    setTitle('');
    setAuthor('');
    setCategory('小説');
    setRating(3);

    setSnackbar({ open: true, message: `「${newBook.title}」を追加しました`, severity: 'success' });
  };

  // 「削除」ボタンが押された時の処理
  const handleDeleteBook = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // ダイアログが開かないようにイベント伝播を停止
    const targetBook = books.find((book) => book.id === id);
    setBooks(books.filter((book) => book.id !== id));

    setSnackbar({ open: true, message: `「${targetBook?.title || '書籍'}」を削除しました`, severity: 'error' });
  };

  // ステータス（未読/読了）の切り替え処理
  const handleToggleStatus = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // ダイアログが開かないようにイベント伝播を停止
    setBooks(
      books.map((book) =>
        book.id === id
          ? { ...book, status: book.status === '未読' ? '読了' : '未読' }
          : book
      )
    );
  };

  // 通知を閉じる処理
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // 検索キーワード ＆ タブ選択でフィルタリングされた書籍一覧
  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (tabValue === 1) return book.status === '未読';
    if (tabValue === 2) return book.status === '読了';
    return true;
  });

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">
            書籍管理アプリ
          </Typography>
        </Toolbar>
      </AppBar>

      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
        {/* 入力フォームエリア */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          <TextField
            label="書籍のタイトル"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TextField
            label="著者名"
            variant="outlined"
            fullWidth
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
          
          <FormControl fullWidth variant="outlined">
            <InputLabel id="category-select-label">ジャンル</InputLabel>
            <Select
              labelId="category-select-label"
              value={category}
              label="ジャンル"
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="小説">小説</MenuItem>
              <MenuItem value="技術書">技術書</MenuItem>
              <MenuItem value="ビジネス">ビジネス</MenuItem>
              <MenuItem value="漫画">漫画</MenuItem>
              <MenuItem value="その他">その他</MenuItem>
            </Select>
          </FormControl>

          <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Typography component="legend">おすすめ度:</Typography>
            <Rating
              value={rating}
              onChange={(_, newValue) => setRating(newValue)}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleAddBook}
          >
            追加
          </Button>
        </div>

        {/* タブナビゲーションエリア */}
        <Box style={{ borderBottom: 1, borderColor: 'divider', marginBottom: '20px' }}>
          <Tabs value={tabValue} onChange={(_, newValue) => setTabValue(newValue)} centered>
            <Tab label="すべて" />
            <Tab label="未読" />
            <Tab label="読了" />
          </Tabs>
        </Box>

        {/* 検索・絞り込みエリア */}
        <TextField
          label="書籍を検索（タイトル・著者・ジャンル）"
          variant="outlined"
          size="small"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '20px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* 書籍一覧エリア */}
        <Typography variant="h6" style={{ marginBottom: '12px' }}>
          登録済みの書籍 ({filteredBooks.length} / {books.length}冊)
        </Typography>

        {filteredBooks.length === 0 ? (
          <Typography color="textSecondary">
            {books.length === 0
              ? '登録された書籍はまだありません。上のフォームから追加してください。'
              : '該当する書籍が見つかりませんでした。'}
          </Typography>
        ) : (
          filteredBooks.map((book) => (
            <Card
              key={book.id}
              style={{ marginBottom: '12px', cursor: 'pointer' }}
              onClick={() => setSelectedBook(book)}
            >
              <CardContent style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Typography variant="h6">
                      {book.title}
                    </Typography>
                    <Chip
                      label={book.category}
                      variant="outlined"
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={book.status}
                      color={book.status === '読了' ? 'success' : 'default'}
                      size="small"
                      onClick={(e) => handleToggleStatus(book.id, e)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <Typography color="textSecondary" style={{ marginBottom: '4px' }}>
                    {book.author}
                  </Typography>
                  <Rating value={book.rating} readOnly size="small" />
                </div>
                <IconButton color="error" onClick={(e) => handleDeleteBook(book.id, e)}>
                  <DeleteIcon />
                </IconButton>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* 詳細ダイアログ */}
      <Dialog open={Boolean(selectedBook)} onClose={() => setSelectedBook(null)} fullWidth maxWidth="xs">
        {selectedBook && (
          <>
            <DialogTitle>書籍の詳細情報</DialogTitle>
            <DialogContent dividers>
              <Typography variant="h6" gutterBottom>{selectedBook.title}</Typography>
              <Typography color="textSecondary" paragraph>著者: {selectedBook.author}</Typography>
              <Typography paragraph>ジャンル: {selectedBook.category}</Typography>
              <Typography paragraph>ステータス: {selectedBook.status}</Typography>
              <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Typography>評価:</Typography>
                <Rating value={selectedBook.rating} readOnly />
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* 通知コンポーネント */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}