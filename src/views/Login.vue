<template>
  <div class="card">
    <div class="card-header">
      <h2>Login</h2>
    </div>
    <div class="card-body">
      <p>Hi, Welcome back!</p>
      <form @submit.prevent="handleForm">
        <div class="form-group">
          <label for="email">Email</label>
          <input type="text" id="email" v-model="email" class="form-control" autocomplete="off">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" class="form-control" autocomplete="off">
        </div>
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <router-link to="/register">Sign Up</router-link></p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      email: null,
      password: null
    }
  },
  methods: {
    ...mapActions(['login']),
    async handleForm () {
      try {
        const result = await this.login({
          email: this.email,
          password: this.password
        })

        if (result.status === 'Failed') {
          alert(result.message)
        }

        return this.$router.push({ path: '/home' })
      } catch (error) {
        alert(error)
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
  p:last-child
    margin-top: 2em
    margin-bottom: 0
    text-align: center
    a
      color: #7E98DF
      text-decoration: none
    a:hover
      text-decoration: underline

@media (max-width: 768px)
  .card
    width: 95%
    padding: 1em
</style>
