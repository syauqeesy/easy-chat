<template>
  <div class="container">
    <main>
      <aside>
        <div class="aside-header">
          <h2 @click="$router.push({ path: '/home' })">EasyChat</h2>
          <svg @click="showMenu = !showMenu" width="22" height="19" viewBox="0 0 22 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="22" height="3.3" rx="1.65" fill="#7E98DF"/>
            <rect y="7.69995" width="13.2" height="3.3" rx="1.65" fill="#7E98DF"/>
            <rect y="15.4" width="22" height="3.3" rx="1.65" fill="#7E98DF"/>
          </svg>
          <div v-show="showMenu" class="menu">
            <p @click="logout">Logout</p>
            <p @click="$router.push({ path: '/settings' })">Settings</p>
          </div>
        </div>
        <div class="aside-body">
          <div class="add-friend">
            <input type="text" class="form-control" v-model="friendUsername" @keypress.enter="runAddFriend" placeholder="Add friend">
          </div>
          <div class="classification">
            <p class="active">All</p>
            <p>Important</p>
            <p>Unread</p>
          </div>
          <div @click="$router.push({ path: `/conversation/${chat.uuid}` }).catch(() => {})" class="chat" v-for="chat in chats" :key="chat.id">
            <img :src="chat.user.avatar" alt="Profile Picture">
            <span>
              <p class="name">{{ chat.user.name }}</p>
              <p class="last-message">{{ chat.lastMessage.body }}</p>
            </span>
            <p class="time">{{ moment(chat.lastMessage.createdAt).format('LT') }}</p>
          </div>
        </div>
      </aside>
      <section class="main">
        <p>Please select a chat to start messaging</p>
      </section>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'Home',
  data () {
    return {
      moment,
      friendUsername: '',
      showMenu: false
    }
  },
  computed: {
    ...mapGetters(['user', 'userUuid', 'chats'])
  },
  methods: {
    ...mapActions(['getUser', 'updateUser', 'getChats', 'addFriend']),
    runAddFriend () {
      this.addFriend(this.friendUsername)
      this.friendUsername = ''
    },
    logout () {
      localStorage.removeItem('userId')
      localStorage.removeItem('token')
      localStorage.removeItem('userUuid')
      this.$router.push({ path: '/login' })
    }
  },
  async mounted () {
    this.getChats()
      .then(() => {
        //
      })
    this.$getLocation({
      enableHighAccuracy: true
    })
      .then(async coordinates => {
        const formData = new FormData()
        formData.append('userUuid', this.userUuid)
        formData.append('lat', coordinates.lat)
        formData.append('lng', coordinates.lng)

        await this.updateUser(formData)
      })
  }
}
</script>

<style scoped lang="sass">
.container
  width: 1280px
  margin: auto
  main
    margin-top: 2em
    height: 540px
    background-color: white
    padding: 1em
    display: flex
    border-radius: .5em
    aside
      flex: 1
      .aside-header
        display: flex
        justify-content: space-between
        align-items: center
        .menu
          position: absolute
          background-color: #7E98DF
          padding: 1em
          width: 300px
          border-radius: .3em
          top: 100px
          p
            color: white
            margin: 1em 0
            cursor: pointer
        h2
          color: #7E98DF
          cursor: pointer
        svg
          cursor: pointer
      .aside-body
        .add-friend
          margin: 3em 0 1em 0
          .form-control
            display: block
            width: 100%
            border: none
            border-bottom: 1px solid #DDDDDD
            padding: 0 1em
            font-size: 1.2em
            outline: none
        .classification
          margin: 2em 0
          display: flex
          justify-content: space-around
          p
            font-weight: 600
            padding: .3em
            border-radius: .3em
          p.active
            background-color: #7E98DF
            color: white
        .chat
          display: flex
          align-items: center
          margin: 1em 0
          img
            object-fit: cover
            width: 50px
            border-radius: .3em
        .chat
          display: flex
          align-items: center
          cursor: pointer
          p
            font-size: .9em
          span
            margin-left: 1em
            p.name
              font-weight: bold
              font-size: 1em
              margin-bottom: .5em
            p.last-message
              color: #858585
          p.time
            color: #858585
            margin-left: auto
    section.main
      display: flex
      align-items: center
      flex: 3
      p
        width: 100%
        text-align: center

@media (max-width: 768px)
  .container
    width: 95%
    main
      padding: 1em
      section.main
        display: none
</style>
