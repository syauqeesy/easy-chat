<template>
  <div class="container">
    <main>
      <aside>
        <div class="aside-header">
          <svg @click="$router.push({ path: '/home' })" width="11" height="19" viewBox="0 0 11 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.20711 9.3271L9.22925 3.30496C9.24226 3.29283 9.2551 3.28044 9.26777 3.26777L9.97487 2.56066C10.5607 1.97487 10.5607 1.02513 9.97487 0.43934C9.38909 -0.146447 8.43934 -0.146447 7.85355 0.43934L7.52579 0.767105L7.52513 0.766442L0.732233 7.55933C-0.244077 8.53564 -0.244079 10.1186 0.732233 11.0949L7.14646 17.5091L7.52513 17.8878L7.85357 18.2162C8.43936 18.802 9.3891 18.802 9.97489 18.2162C10.5607 17.6304 10.5607 16.6807 9.97489 16.0949L9.64645 15.7664L9.26778 15.3878C9.26635 15.3863 9.2649 15.3849 9.26346 15.3835L3.20711 9.3271Z" fill="#7E98DF"/>
          </svg>
          <h2>{{ user.username }}</h2>
        </div>
        <div class="aside-body">
          <img :src="user.avatar" alt="Profile Picture" class="profile-picture">
          <input type="file"  @change="handleForm($event)">
          <h3>{{ user.name }}</h3>
          <div class="phone-number">
            <p>{{ user.phonenumber }}</p>
            <p>Phonenumber</p>
          </div>
          <div class="email">
            <p>{{ user.email }}</p>
            <p>Email</p>
          </div>
          <div class="bio">
            <p>{{ user.bio }}</p>
            <p>Bio</p>
          </div>
          <div class="location">
            <p>My location :</p>
            <GmapMap
              :center="{lat:parseInt(user.lat), lng:parseInt(user.lng)}"
              :zoom="7"
              map-type-id="terrain"
              style="width: 100%; height: 200px"
            >
              <GmapMarker
                :position="{lat:Number(user.lat), lng:Number(user.lng)}"
                :clickable="true"
                :draggable="true"
                @click="center=m.position"
              />
            </GmapMap>
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

export default {
  name: 'Home',
  computed: {
    ...mapGetters(['user', 'userUuid'])
  },
  methods: {
    ...mapActions(['getUser', 'updateUser']),
    async handleForm (event) {
      const formData = new FormData()
      const file = event.target.files[0]
      formData.append('avatar', file, file.name)
      formData.append('userUuid', localStorage.getItem('userUuid'))
      const result = await this.updateUser(formData)
      alert(result.message)
    }
  },
  created () {
    this.getUser(this.userUuid)
  }
}
</script>

<style scoped lang="sass">
.container
  width: 1280px
  margin: auto
  main
    margin-top: 2em
    background-color: white
    padding: 1em
    display: flex
    border-radius: .5em
    aside
      flex: 1
      h3
        text-align: center
      .phone-number
        margin: 1.5em 0
        > p:first-child
          font-weight: bold
          margin-bottom: .5em
        > p:last-child
          font-size: .9em
          color: #858585
      .email
        margin: 1.5em 0
        > p:first-child
          font-weight: bold
          margin-bottom: .5em
        > p:last-child
          font-size: .9em
          color: #858585
      .bio
        margin: 1.5em 0
        > p:first-child
          font-weight: bold
          margin-bottom: .5em
        > p:last-child
          font-size: .9em
          color: #858585
      .location
        margin: 2em 0
        p
          color: #858585
          font-size: .9em
          margin-bottom: .5em
      .aside-header
        display: flex
        justify-content: space-between
        align-items: center
        h2
          color: #7E98DF
          cursor: pointer
          width: 100%
          text-align: center
        svg
          cursor: pointer
      .aside-body
        .profile-picture
          width: 75px
          height: 75px
          object-fit: cover
          display: block
          margin: 1em auto
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
