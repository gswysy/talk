//登录和注册通用代码

class FieldValidator{
    /**
     * 构造器
     * @param {string} inputId 验证文本框的ID
     * @param {function} validatorFunc 检验函数,检验成功无返回值，检验失败返回失败原因
     */
    constructor(inputId, validatorFunc) {
        this.input = $('#' + inputId);
        this.p = this.input.nextElementSibling;
        this.validatorFunc = validatorFunc;
        this.input.onblur = () => {
            this.validate();
        }
    }
    
    /**
     * 验证函数,成功返回true,失败返回false
     */
    async validate() {
        const err = await this.validatorFunc(this.input.value);
        if (err) {
            //错误
            this.p.innerText = err;
            return false;
        } else {
            this.p.innerText = '';
            return true;
        }
    }

    /**
     * 对所有文本框进行检验，全部成功返回true，否则false
     * @param  {FieldValidator[]} validators 
     */
    static async validate(...validators) {
        const proms = validators.map(item => item.validate());
        const results = await Promise.all(proms);
        return results.every(s => s);
    }
}