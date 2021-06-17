<template>
<a-modal
      title="修改密码"
      :visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="handleCancel"
    >
  <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout">
    <a-form-model-item has-feedback label="Password" prop="pass">
      <a-input v-model="ruleForm.pass" type="password" autocomplete="off" />
    </a-form-model-item>
    <a-form-model-item has-feedback label="Confirm" prop="checkPass">
      <a-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
    </a-form-model-item>
  </a-form-model>
  </a-modal>
</template>
<script>
import userRequest from '@/request/user'
import chartDataFun from '@/utils/chartDataFun'
export default {
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password!/请输入密码!'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('Please input the password again!/请再次输入密码!'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error("Two inputs don't match!/两次输入不一致!"));
      } else {
        callback();
      }
    };
    return {
      confirmLoading:false,
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [{ validator: validatePass, trigger: 'change' }],
        checkPass: [{ validator: validatePass2, trigger: 'change' }]
      },
      layout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 14 },
      },
    };
  },
  props:['visible'],
  methods: {
    async handleOk(e) {
      await chartDataFun.become();
      this.confirmLoading = true;
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
            const user = new this.$Parse.User.current();
            new this.$Parse.Cloud.run('changePassword',{password:this.ruleForm.pass}).then(res=>{
            this.$message.success('密码修改成功,请重新登录！');
            this.$parent.visible = false;
            this.confirmLoading = false;
            userRequest.logOut();
            this.$storage.clear();
            this.$store.commit('setUserInfo',{});
          },error=>{
            this.$message.error('密码修改失败')
            this.confirmLoading = false;
            return false;
          })
        } else {
            this.confirmLoading = false;
        }
      });
    },
    handleCancel(e) {
        this.$refs['ruleForm'].resetFields();
      this.$parent.visible = false;
    }
  },
};
</script>