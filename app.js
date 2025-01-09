const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

// 连接MongoDB数据库
mongoose.connect('mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Could not connect to MongoDB', err);
});

// 使用body-parser中间件解析请求体
app.use(bodyParser.json());

// 注册路由
app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.status(201).send('User registered successfully');
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

// 登录路由
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (user && user.password === password) {
            res.send('Logged in successfully');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        res.status(500).send('Error logging in');
    }
});

// 监听端口
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
