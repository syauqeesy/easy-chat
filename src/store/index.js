import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import io from 'socket.io-client'

Vue.use(Vuex)
const backend = process.env.VUE_APP_BACKEND

export default new Vuex.Store({
  state: {
    socket: io(backend),
    user: {},
    userUuid: null || localStorage.getItem('userUuid'),
    token: null || localStorage.getItem('token'),
    userId: null || localStorage.getItem('userId'),
    chats: [],
    messages: []
  },
  mutations: {
    SET_USER (state, payload) {
      state.user = payload
    },
    SET_CREDENTIALS (state, payload) {
      state.token = payload.token
      state.userUuid = payload.userUuid
      state.userId = payload.userId
    },
    SET_CHATS (state, payload) {
      state.chats = payload
    },
    SET_MESSAGES (state, payload) {
      state.messages = payload
    }
  },
  actions: {
    async register (_, payload) {
      try {
        const result = await axios.post(`${backend}/api/users/register`, payload)
        return result.data
      } catch (error) {
        return error.response.data
      }
    },
    async login ({ commit }, payload) {
      try {
        const result = await axios.post(`${backend}/api/users/login`, payload)
        localStorage.setItem('userUuid', result.data.data.userUuid)
        localStorage.setItem('userId', result.data.data.userId)
        localStorage.setItem('token', `Bearer ${result.data.data.token}`)
        commit('SET_CREDENTIALS', {
          token: result.data.data.token,
          userUuid: result.data.data.userUuid,
          userId: result.data.data.userId
        })
        return result.data
      } catch (error) {
        return error.response.data
      }
    },
    async getUser ({ state, commit }, payload) {
      try {
        const result = await axios.get(`${backend}/api/users/${payload}`, { headers: { authorization: localStorage.getItem('token') } })
        commit('SET_USER', result.data.user)
        return result.data
      } catch (error) {
        return error.response.data
      }
    },
    async updateUser ({ state, dispatch }, payload) {
      try {
        const result = await axios.patch(`${backend}/api/users/${payload.get('userUuid')}`, payload, { headers: { authorization: localStorage.getItem('token') } })
        dispatch('getUser', payload.get('userUuid'))
        return result.data
      } catch (error) {
        return error.response.data
      }
    },
    async getChats ({ state, commit }) {
      try {
        const result = await axios.get(`${backend}/api/chats`, { headers: { authorization: localStorage.getItem('token') } })
        commit('SET_CHATS', result.data.chats)
        return result.data
      } catch (error) {
        return error.response.data
      }
    },
    async getMessages ({ state, commit }, payload) {
      try {
        const result = await axios.get(`${backend}/api/chats/messages/${payload}`, { headers: { authorization: localStorage.getItem('token') } })
        commit('SET_MESSAGES', result.data.messages)
        return result.data
      } catch (error) {
        return error.response.data
      }
    },
    async addFriend ({ dispatch, state }, payload) {
      try {
        const result = await axios.post(`${backend}/api/users/add-friend/${payload}`, {}, { headers: { authorization: localStorage.getItem('token') } })
        const friend = await axios.get(`${backend}/api/users/${result.data.friend.friendUserId}`, { headers: { authorization: localStorage.getItem('token') } })
        dispatch('createPersonalChat', {
          userUuid: localStorage.getItem('userUuid'),
          toUserUuid: friend.data.user.uuid
        })
        return result.data
      } catch (error) {
        return error.response.data
      }
    },
    async createPersonalChat ({ dispatch }, payload) {
      try {
        const result = await axios.post(`${backend}/api/chats/create`, payload, { headers: { authorization: localStorage.getItem('token') } })
        console.log(result.data)
        dispatch('getChats')
        return result.data
      } catch (error) {
        console.log(error.response.data)
        return error.response.data
      }
    }
  },
  getters: {
    socket (state) {
      return state.socket
    },
    user (state) {
      return state.user
    },
    token (state) {
      return state.token
    },
    userUuid (state) {
      return state.userUuid
    },
    userId (state) {
      return state.userId
    },
    chats (state) {
      return state.chats
    },
    messages (state) {
      return state.messages
    }
  }
})
