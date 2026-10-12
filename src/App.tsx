import FileUpload from './components/FileUpload'

function App() {
  return (
    <main>
      <h1>Dashboard Analytics</h1>
      <p>Завантаж CSV або Excel файл, щоб побачити аналітику.</p>
      <FileUpload />
    </main>
  )
}

export default App