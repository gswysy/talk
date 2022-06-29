const loginIdValidator = new FieldValidator('txtLoginId', async (value) => { 
    if (!value) {
        return '账号不能为空';
    }
});

const loginPwdValidator = new FieldValidator('txtLoginPwd', (value) => {
    if (!value) {
        return '密码不能为空';
    } 
});

const form = $('.user-form');

form.onsubmit = async function (e) {
    e.preventDefault();
    const key = await FieldValidator.validate(loginIdValidator, loginPwdValidator);
    if (key) {
        const resp=await API.login({
            loginId: loginIdValidator.input.value,
            loginPwd: loginPwdValidator.input.value
        });
        if (resp.code === 0) {
            location.href = './index.html';
        } else {
            loginIdValidator.p.innerText = resp.msg;
        }
    }
}
