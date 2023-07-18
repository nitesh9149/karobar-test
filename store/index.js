import axios from 'axios'

axios.defaults.baseURL = 'https://backend.karobarapp.com'

export const state = () => ({
  /* User */
  userName: null,
  userEmail: null,
  userAvatar: null,
  dateState: "",

  /* NavBar */
  isNavBarVisible: true,

  /* FooterBar */
  isFooterBarVisible: true,

  /* Aside */
  isAsideVisible: true,
  isAsideMobileExpanded: false,
  isAsideExpanded: true,
  modalState: false,
  pageModal: false,
  pageModalOpen: false,
  counter: 0

})

export const mutations = {
  /* A fit-them-all commit */
  addDate(state, date) {
    state.dateState = date
  },

  basic(state, payload) {
    state[payload.key] = payload.value
  },

  /* User */
  user(state, payload) {
    if (payload.name) {
      state.userName = payload.name
    }
    if (payload.email) {
      state.userEmail = payload.email
    }
    if (payload.avatar) {
      state.userAvatar = payload.avatar
    }
  },

  /* Aside Mobile */
  asideMobileStateToggle(state, payload = null) {
    const htmlClassName = 'has-aside-mobile-expanded'

    let isShow

    if (payload !== null) {
      isShow = payload
    } else {
      isShow = !state.isAsideMobileExpanded
    }

    if (isShow) {
      document.documentElement.classList.add(htmlClassName)
    } else {
      document.documentElement.classList.remove(htmlClassName)
    }

    state.isAsideMobileExpanded = isShow
  },
  asideStateToggle(state, payload = null) {
    const htmlClassName = 'has-aside-expanded'

    let isShow

    if (payload !== null) {
      isShow = payload
    } else {
      isShow = !state.isAsideExpanded
    }

    if (isShow) {
      document.documentElement.classList.add(htmlClassName)
    } else {
      document.documentElement.classList.remove(htmlClassName)
    }

    state.isAsideExpanded = isShow
  },

  modalChange(state) {
    // state.modalState = true;
  },
  modalOpen(state) {
    state.pageModalOpen = true;
  },
  toggleModal(state) {
    state.pageModal = !state.pageModal;
  },
  modalClose(state) {
    state.pageModal = false;
  },
  transition(state) {
    state.counter++
  },
}
export const actions = {
  dateTransfer({ commit }, date) {
    commit("addDate", date);
  },
};