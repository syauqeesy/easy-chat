<template>
  <div class="card">
    <div class="card-header">
      <router-link to="/login">
        <svg width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M3.20711 9.3271L9.22925 3.30496C9.24226 3.29283 9.2551 3.28044 9.26777 3.26777L9.97487 2.56066C10.5607 1.97487 10.5607 1.02513 9.97487 0.43934C9.38909 -0.146447 8.43934 -0.146447 7.85355 0.43934L7.52579 0.767105L7.52513 0.766442L0.732233 7.55933C-0.244077 8.53564 -0.244079 10.1186 0.732233 11.0949L7.14646 17.5091L7.52513 17.8878L7.85357 18.2162C8.43936 18.802 9.3891 18.802 9.97489 18.2162C10.5607 17.6304 10.5607 16.6807 9.97489 16.0949L9.64645 15.7664L9.26778 15.3878C9.26635 15.3863 9.2649 15.3849 9.26346 15.3835L3.20711 9.3271Z" fill="#7E98DF"/>
        </svg>
      </router-link>
      <h2>Register</h2>
    </div>
    <div class="card-body">
      <p>Let's create your account!</p>
      <form @submit.prevent="handleForm">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="name" class="form-control" autocomplete="off">
          <p v-show="formInvalid">salah</p>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email" class="form-control" autocomplete="off">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" class="form-control" autocomplete="off">
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Register',
  data () {
    return {
      name: null,
      email: null,
      password: null
    }
  },
  methods: {
    ...mapActions(['register']),
    async handleForm () {
      try {
        const result = await this.register({
          name: this.name,
          email: this.email,
          password: this.password
        })
        alert(result.message)
        if (result.status === 'Success') {
          return this.$router.push({ path: '/login' })
        }
      } catch (error) {
        alert(error.message)
      }
    }
  }
}
</script>

<style scoped lang="sass">
.card
  width: 480px
  border-radius: .5em
  padding: 2em
  background-color: white
  margin: 3em auto
  .card-header
    display: flex
    align-items: center
    h2
      color: #7E98DF
      text-align: center
      width: 100%
  .card-body
    margin-top: 2em
    p
      font-size: .8em
      margin-bottom: 2.5em
    form
      .form-group
        margin-bottom: 2.5em
        label
          font-size: .8em
          color: #555555
        .form-control
          display: block
          width: 100%
          height: 2em
          outline: none
          padding: 0 .5em
          font-size: 1.2em
          border: none
          border-bottom: 1px solid #888888
    button
      display: block
      width: 100%
      border: none
      background-color: #7E98DF
      padding: .7em
      outline: none
      cursor: pointer
      font-size: 1.1em
      color: white
      border-radius: 2em
    button:hover
      background-color: darken(#7E98DF, 5%)

@media (max-width: 768px)
  .card
    width: 95%
    padding: 1em
</style>
