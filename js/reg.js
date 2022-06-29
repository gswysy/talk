const loginIdValidator = new FieldValidator('txtLoginId', async (value) => { 
    if (!value) {
        return '账号不能为空';
    }
    const resp = await API.exists(value);
    if (resp.data) {
        return '账号已存在';
    }
});

const nickNameValidator = new FieldValidator('txtNickname',(value) => {
    if (!value) {
        return '昵称不能为空';
    }
});

const loginPwdValidator = new FieldValidator('txtLoginPwd', (value) => {
    if (!value) {
        return '密码不能为空';
   } 
});

const loginPwdConfirmValidator = new FieldValidator('txtLoginPwdConfirm', value => {
    if (!value) {
        return '请确认密码';
    } else if (loginPwdValidator.input.value !== value) {
        return '两次密码不一致';
    }
});

const form = $('.user-form');

form.onsubmit = async function (e) {
    e.preventDefault();
    const key = await FieldValidator.validate(loginIdValidator, nickNameValidator, loginPwdValidator, loginPwdConfirmValidator);
    if (key) {
        const resp=await API.reg({
            loginId: loginIdValidator.input.value,
            nickname: nickNameValidator.input.value,
            loginPwd: loginPwdValidator.input.value
        });
        if (resp.code === 0) {
            if (confirm()) {
                location.href = './login.html';
            }
        }
    }
}
