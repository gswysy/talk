(async function () {
    const resp = await API.profile();
    const user = resp.data;
    if (!user) {
        alert('未登录或登录已过期，请重新登录');
        location.href = './login.html';
        return;
    }

    const doms = {
        p_nickname: $('#nickname'),
        p_loginId: $('#loginId'),
        chat_container: $('.chat-container'),
        form: $('.msg-container'),
        input: $('#txtMsg'),
        close:$('.close')
    }

    setUserInfo();
    //渲染用户信息
    function setUserInfo() {
        doms.p_loginId.innerText = user.loginId;
        doms.p_nickname.innerText = user.nickname;
    }

    //格式化时间
    function formatDate(timer) {
        const date = new Date(timer);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2,'0');
        const day = date.getDate().toString().padStart(2, '0');
        const hour = date.getHours().toString().padStart(2, '0');
        const minute = date.getMinutes().toString().padStart(2, '0');
        const second = date.getSeconds().toString().padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    }

    //设置滚动条
    function scrollBottom() {
        doms.chat_container.scrollTop = doms.chat_container.scrollHeight;
    }

    //添加信息
    function addChat(info) {
        const div = $$$('div');
        div.classList.add('chat-item');
        if (info.from) {
            div.classList.add('me');
        }
        const img = $$$('img');
        img.classList.add('chat-avatar');
        img.src = info.from ? './asset/avatar.png' : './asset/robot-avatar.jpg';
        div.appendChild(img);
        const content = $$$('div');
        content.classList.add("chat-content");
        content.innerText = info.content;
        div.appendChild(content);
        const time = $$$('div');
        time.classList.add('chat-date');
        time.innerText = formatDate(info.createdAt);
        div.appendChild(time);
        doms.chat_container.appendChild(div);
        formatDate(info.createdAt);
    }

    loadHistory();
    //加载历史信息
    async function loadHistory() {
        const resp = await API.getHistory();
        const chatArr = resp.data;
        chatArr.forEach((item) => {
            addChat(item);
        })
        scrollBottom();
    }
    //发送信息
    async function sendChat() {
        const content = doms.input.value;
        if (!content) {
            return;
        }
        addChat({
            from: user.loginId,
            content,
            createdAt:Date.now()
        })
        doms.input.value = '';
        scrollBottom();
        const resp = await API.sendChat(content);
        addChat({
            from: null,
            content: resp.data.content,
            createdAt:resp.data.createdAt
        })
        scrollBottom();
    }

    //表单提交
    doms.form.addEventListener('submit', function (e) {
        e.preventDefault();
        sendChat();
    });

    //关闭聊天窗口
    doms.close.addEventListener('click', function () {
        API.loginOut();
        location.href = './login.html';
    })
})();