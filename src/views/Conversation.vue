<template>
  <div class="container">
    <main>
      <aside>
        <div class="aside-header">
          <h2 @click="() => { socket.emit('changeChat', $route.params.chatUuid); $router.push({ path: '/home' }); }">EasyChat</h2>
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
          <div class="classification">
            <p class="active">All</p>
            <p>Important</p>
            <p>Unread</p>
          </div>
          <div @click="changeChat(chat.uuid)" class="chat" v-for="chat in chats" :key="chat.id">
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
        <div class="conversation-header">
        </div>
        <div class="conversation-body" ref="conversation">
          <div class="message" v-for="message in messages" :key="message.id" :class="{is_sender: message.senderId === parseInt(userId)}">
            <p class="message-body">{{ message.body }}</p>
            <p class="message-time">{{ moment(message.createdAt).format('LT') }}</p>
          </div>
        </div>
        <form class="conversation-footer" @submit.prevent="handleForm">
          <input type="text" v-model="messageBody" class="form-control" placeholder="Type a message" autocomplete="off">
        </form>
      </section>
    </main>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'Conversation',
  data () {
    return {
      moment,
      messageBody: '',
      showMenu: false
    }
  },
  computed: {
    ...mapGetters(['user', 'userUuid', 'chats', 'messages', 'userId', 'socket'])
  },
  methods: {
    ...mapActions(['getUser', 'updateUser', 'getChats', 'getMessages']),
    handleForm () {
      const message = {
        chatUuid: this.$route.params.chatUuid,
        senderUuid: this.userUuid,
        body: this.messageBody,
        senderId: parseInt(this.userId),
        token: localStorage.getItem('token')
      }

      this.socket.emit('sendMessage', message)
      this.messages.push(message)
      this.messageBody = ''
      this.$refs.conversation.scrollTop = this.$refs.conversation.scrollHeight
      this.getChats()
        .then(() => {
          //
        })
    },
    logout () {
      localStorage.removeItem('userId')
      localStorage.removeItem('token')
      localStorage.removeItem('userUuid')
      this.$router.push({ path: '/login' })
    },
    changeChat (uuid) {
      if (this.$route.params.chatUuid === uuid) {
        return
      }
      console.log(this.$route.params.chatUuid)
      this.socket.emit('changeChat', this.$route.params.chatUuid)
      this.$router.push({ path: `/conversation/${uuid}` }).catch(() => {})
    }
  },
  async mounted () {
    this.socket.emit('joinRoom', this.$route.params.chatUuid)
    this.socket.on('message', message => {
      this.messages.push(message)
      this.$refs.conversation.scrollTop = this.$refs.conversation.scrollHeight
      this.getChats()
        .then(() => {
          //
        })
      this.$notification.show('Easy Chat', {
        body: 'You have new message!'
      }, {})
    })
    this.getChats()
      .then(() => {
        //
      })
    this.getMessages(this.$route.params.chatUuid)
      .then(() => {
        this.$refs.conversation.scrollTop = this.$refs.conversation.scrollHeight
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
  },
  watch: {
    $route () {
      this.getMessages(this.$route.params.chatUuid)
        .then(() => {
          console.log(this.messages)
          this.socket.emit('joinRoom', this.$route.params.chatUuid)
        })
    }
  },
  updated () {
    this.$refs.conversation.scrollTop = this.$refs.conversation.scrollHeight
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
      flex: 3
      .conversation-header
        height: 50px
      .conversation-body
        height: 400px
        overflow-y: scroll
        padding: 1em
        .message
          background-color: #7E98DF
          color: white
          max-width: 50%
          padding: 1em
          border-radius: 1.5em 1.5em 1.5em .5em
          margin: 1em 0
          .message-body
            margin-bottom: .5em
          .message-time
            font-size: .9em
        .is_sender
          background-color: white
          color: #7E98DF
          margin: 1em 0
          border-radius: 1.5em 1.5em .5em 1.5em
          border: 1px solid #EEEEEE
          margin-left: auto
      .conversation-footer
        margin-top: .5em
        box-shadow: 1px 3px 3px rgba(0, 0, 0, .1)
        border-radius: .5em
        .form-control
          display: block
          height: 1.5em
          font-size: 1.3em
          width: 100%
          padding: 1em 1em
          outline: none
          border: none

@media (max-width: 768px)
  .container
    width: 95vw
    main
      padding: .5em
      height: 95vh
      aside
        display: none
      section.main
        .conversation-body
          height: 75vh
          padding: 0
</style>
