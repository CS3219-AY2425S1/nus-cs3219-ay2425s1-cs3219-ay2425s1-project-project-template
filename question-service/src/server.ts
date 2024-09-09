import app from './index';

const PORT = process.env.PORT || 8003;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
