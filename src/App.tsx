import { useRef, useState } from 'react';
import { Alert, Button, Chip, CssBaseline, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Rating, Select, Snackbar, TextField, ThemeProvider, createTheme } from '@mui/material';
import { AddRounded, ArrowForwardRounded, AutoStoriesRounded, BookmarkBorderRounded, CheckRounded, CloseRounded, DeleteOutlineRounded, SearchRounded } from '@mui/icons-material';
import './App.css';

interface Book { id: number; title: string; author: string; category: string; status: '未読' | '読了'; rating: number }
const categories = ['小説', '技術書', 'ビジネス', '漫画', 'その他'];
const theme = createTheme({
  palette: { primary: { main: '#244c3e' }, background: { default: '#f7f8f4', paper: '#ffffff' }, text: { primary: '#263b33', secondary: '#7b857e' } },
  typography: { fontFamily: '"Helvetica Neue", "Hiragino Kaku Gothic ProN", "Yu Gothic", sans-serif', button: { textTransform: 'none', fontWeight: 600 } },
  shape: { borderRadius: 10 },
  components: { MuiButton: { defaultProps: { disableElevation: true }, styleOverrides: { root: { padding: '11px 20px' } } }, MuiOutlinedInput: { styleOverrides: { root: { backgroundColor: '#fff', fontSize: 14 }, notchedOutline: { borderColor: '#dde3dc' } } }, MuiRating: { styleOverrides: { iconFilled: { color: '#c5a264' } } } },
});

export default function App() {
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('小説');
  const [rating, setRating] = useState<number | null>(3);
  const [tab, setTab] = useState('すべて');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const titleInput = useRef<HTMLInputElement>(null);
  const selected = books.find(book => book.id === selectedId);
  const completed = books.filter(book => book.status === '読了').length;
  const filtered = books.filter(book => (tab === 'すべて' || book.status === tab) && `${book.title} ${book.author} ${book.category}`.toLowerCase().includes(query.trim().toLowerCase()));
  const focusForm = () => { titleInput.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }); titleInput.current?.focus({ preventScroll: true }); };
  const toggle = (id: number) => setBooks(current => current.map(book => book.id === id ? { ...book, status: book.status === '読了' ? '未読' : '読了' } : book));
  const remove = (book: Book) => { setBooks(current => current.filter(item => item.id !== book.id)); setSelectedId(null); setMessage(`「${book.title}」を削除しました`); };
  const addBook = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;
    setBooks(current => [...current, { id: Date.now(), title: title.trim(), author: author.trim() || '著者不明', category, rating: rating ?? 0, status: '未読' }]);
    setMessage(`「${title.trim()}」を本棚に追加しました`);
    setTitle(''); setAuthor(''); setCategory('小説'); setRating(3);
  };
  return <ThemeProvider theme={theme}><CssBaseline />
    <header className="site-header"><div className="header-inner">
      <a className="brand" href="#"><span className="brand-icon"><AutoStoriesRounded /></span><span>余白<span className="brand-english">YOHAKU</span></span></a>
      <div className="header-caption">本と過ごす、わたしの時間。</div><span className="header-tag"><span /> MY PERSONAL LIBRARY</span>
    </div></header>
    <main className="main-shell">
      <section className="hero-panel">
        <div className="hero-copy"><span className="eyebrow">A LITTLE SPACE FOR YOUR STORIES</span><h1>本をひらく。<br />世界が、少し広がる。</h1><p>気になる一冊も、心に残った一冊も。<br />あなただけの本棚を、ここから。</p><Button variant="contained" onClick={focusForm} endIcon={<ArrowForwardRounded />}>本棚に一冊追加する</Button></div>
        <div className="book-art" aria-hidden="true"><div className="art-orbit" /><div className="art-note">Between the pages,<br /><i>find your next chapter.</i></div><div className="art-book book-back"><span>THE ART OF<br />SLOW LIVING</span></div><div className="art-book book-front"><span className="cover-kicker">A COLLECTION OF MOMENTS</span><span className="cover-title">日々の<br />余白</span><span className="cover-line" /><span className="cover-bottom">THE QUIET MOMENTS</span></div><div className="book-shadow" /></div>
        <span className="hero-index">01 — YOUR READING JOURNEY</span>
      </section>
      <section className="stats" aria-label="読書の記録">
        {[{ icon: <AutoStoriesRounded />, label: '本棚の書籍', value: books.length, caption: 'あなたの世界を広げる一冊' }, { icon: <BookmarkBorderRounded />, label: 'これから読む', value: books.length - completed, caption: '次の出会いを、楽しみに' }, { icon: <CheckRounded />, label: '読み終えた本', value: completed, caption: '心に残る、読書の足あと' }].map(item => <div className="stat" key={item.label}><span className="stat-icon">{item.icon}</span><div><span className="stat-label">{item.label}</span><div className="stat-number">{item.value}<span>冊</span></div></div><span className="stat-caption">{item.caption}</span></div>)}
      </section>
      <div className="workspace-grid">
        <aside className="add-panel"><div className="section-kicker">NEW CHAPTER</div><h2><AddRounded /> 本棚に追加</h2><p className="section-description">次に読みたい一冊を、忘れないうちに。</p>
          <form onSubmit={addBook} className="book-form"><label htmlFor="book-title">書籍タイトル <span className="required">必須</span></label><TextField id="book-title" inputRef={titleInput} placeholder="本のタイトルを入力" value={title} onChange={e => setTitle(e.target.value)} required fullWidth size="small" />
            <label htmlFor="book-author">著者名</label><TextField id="book-author" placeholder="著者名を入力" value={author} onChange={e => setAuthor(e.target.value)} fullWidth size="small" />
            <FormControl fullWidth size="small" className="category-field"><InputLabel id="genre-label">ジャンル</InputLabel><Select labelId="genre-label" label="ジャンル" value={category} onChange={e => setCategory(e.target.value)}>{categories.map(item => <MenuItem key={item} value={item}>{item}</MenuItem>)}</Select></FormControl>
            <div className="rating-row"><span>おすすめ度</span><Rating name="book-rating" value={rating} onChange={(_, value) => setRating(value)} getLabelText={value => `${value}つ星`} /></div><Button type="submit" variant="contained" fullWidth startIcon={<AddRounded />} disabled={!title.trim()}>本棚に追加する</Button>
          </form><div className="form-footnote"><BookmarkBorderRounded /> 一冊ずつ、あなたらしい本棚に。</div>
        </aside>
        <section className="library-panel"><div className="library-heading"><div><div className="section-kicker">YOUR COLLECTION</div><h2>わたしの本棚 <span>{books.length}</span></h2></div><span className="library-description">お気に入りが並ぶ場所</span></div>
          <div className="library-toolbar"><div className="filter-tabs" role="group" aria-label="読書ステータスで絞り込み">{['すべて', '未読', '読了'].map(item => <button type="button" aria-pressed={tab === item} className={tab === item ? 'active' : ''} key={item} onClick={() => setTab(item)}>{item}<span>{item === 'すべて' ? books.length : item === '未読' ? books.length - completed : completed}</span></button>)}</div><TextField size="small" placeholder="タイトル・著者・ジャンルで検索" value={query} onChange={e => setQuery(e.target.value)} className="search-field" slotProps={{ htmlInput: { 'aria-label': '本棚を検索' }, input: { startAdornment: <InputAdornment position="start"><SearchRounded fontSize="small" /></InputAdornment> } }} /></div>
          {filtered.length === 0 ? <div className="empty-shelf"><div className="empty-illustration"><AutoStoriesRounded /><span className="little-spark">✦</span></div><span className="empty-kicker">{books.length === 0 ? 'YOUR STORY STARTS HERE' : 'KEEP EXPLORING'}</span><h3>{books.length === 0 ? 'まだ見ぬ一冊との、出会いを。' : '該当する書籍がありません'}</h3><p>{books.length === 0 ? <>本棚は、まだまっさら。<br />気になる本を追加して、読書の記録をはじめましょう。</> : '検索キーワードや絞り込み条件を変えてみてください。'}</p>{books.length === 0 ? <Button onClick={focusForm} startIcon={<AddRounded />}>最初の一冊を追加</Button> : <Button onClick={() => { setQuery(''); setTab('すべて'); }}>絞り込みをリセット</Button>}</div> : <div className="book-list">{filtered.map(book => <article className="book-row" key={book.id}><button className={`mini-cover tone-${categories.indexOf(book.category)}`} onClick={() => setSelectedId(book.id)} aria-label={`${book.title}の詳細`}><AutoStoriesRounded /><span>{book.category}</span></button><button className="book-info" onClick={() => setSelectedId(book.id)}><span className="book-category">{book.category}</span><h3>{book.title}</h3><p>{book.author}</p><Rating value={book.rating} readOnly size="small" /></button><div className="book-actions"><Chip size="small" variant="outlined" label={book.status} onClick={() => toggle(book.id)} icon={book.status === '読了' ? <CheckRounded /> : <BookmarkBorderRounded />} aria-label={`${book.title}を${book.status === '読了' ? '未読' : '読了'}にする`} /><IconButton aria-label={`${book.title}を削除`} onClick={() => remove(book)} size="small"><DeleteOutlineRounded fontSize="small" /></IconButton></div></article>)}</div>}
          <div className="shelf-footer"><span>{filtered.length} / {books.length} 冊を表示</span><span>一冊の本から、新しい視点を。</span></div>
        </section>
      </div><footer className="page-footer"><span>YOHAKU <span>— あなたの毎日に、読書の余白を。</span></span><AutoStoriesRounded fontSize="small" /></footer>
    </main>
    <Dialog open={Boolean(selected)} onClose={() => setSelectedId(null)} fullWidth maxWidth="xs"><DialogTitle className="detail-title">書籍の詳細<IconButton onClick={() => setSelectedId(null)} aria-label="閉じる"><CloseRounded /></IconButton></DialogTitle>{selected && <><DialogContent dividers><Chip size="small" label={selected.category} /><h2>{selected.title}</h2><p>{selected.author}</p><p>ステータス：{selected.status}</p><Rating value={selected.rating} readOnly /></DialogContent><DialogActions><Button onClick={() => toggle(selected.id)}>{selected.status === '未読' ? '読了にする' : '未読に戻す'}</Button><Button onClick={() => setSelectedId(null)}>閉じる</Button></DialogActions></>}</Dialog>
    <Snackbar open={Boolean(message)} autoHideDuration={3500} onClose={() => setMessage('')} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}><Alert severity="success" onClose={() => setMessage('')} variant="filled">{message}</Alert></Snackbar>
  </ThemeProvider>;
}
