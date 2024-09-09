import app from './index';

const PORT = process.env.PORT || 8002;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
