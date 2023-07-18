<template>
  <div>
    <set-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
    />
    <terms-modal
      :is-active="isModalActive2"
      @confirm="trashConfirm2"
      @cancel="trashCancel2"
    />
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Invoice Settings</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section invoice-settings">
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">INVOICE SETTINGS</p>
        </header>
        <div class="card-content">
          <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">Invoice Styles</div>
                <div class="setting-job">
                  <span> <nuxt-link to="/invoiceStyle">Set</nuxt-link> </span>
                </div>
              </div>
            </div>
          </div>
          <!-- <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">Invoice Number Prefix</div>
                <div class="setting-job">
                  <span @click="trashModal()">Set</span>
                </div>
              </div>
            </div>
          </div> -->
          <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">Terms &amp; Conditions</div>
                <div class="setting-job">
                  <span @click="trashModal2()">Edit</span>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">Show Company Logo on Invoice</div>
                <div class="setting-job">
                  <b-field>
                    <b-switch
                      @input="logoStatus"
                      v-model="isSwitchedLogo"
                      type="is-primary"
                    >
                    </b-switch>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">
                  Show Discount for individual item
                </div>
                <div class="setting-job">
                  <b-field>
                    <b-switch
                      @input="discountStatus"
                      v-model="isSwitched"
                      type="is-primary"
                    >
                    </b-switch>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">Show Email on Invoice</div>
                <div class="setting-job">
                  <b-field>
                    <b-switch
                      v-model="isSwitchedEmail"
                      @input="switchEmail"
                      type="is-primary"
                    >
                    </b-switch>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">Show Phone Number on Invoice</div>
                <div class="setting-job">
                  <b-field>
                    <b-switch
                      v-model="isSwitchedPhone"
                      @input="switchPhone"
                      type="is-primary"
                    >
                    </b-switch>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">Show Address on Invoice</div>
                <div class="setting-job">
                  <b-field>
                    <b-switch
                      v-model="isSwitchedAddress"
                      @input="switchAddress"
                      type="is-primary"
                    >
                    </b-switch>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">Show Signature on Invoice</div>
                <div class="setting-job">
                  <b-field>
                    <b-switch
                      v-model="isSwitchedSignature"
                      @input="switchSignature"
                      type="is-primary"
                    >
                    </b-switch>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">Show Bank Details on Invoice</div>
                <div class="setting-job">
                  <b-field>
                    <b-switch
                      v-model="isSwitchedBanks"
                      @input="switchBanks"
                      type="is-primary"
                    >
                    </b-switch>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">Hide Karobar Branding</div>
                <div class="setting-job">
                  <b-field>
                    <b-switch
                      v-model="isSwitchedBranding"
                      @input="switchBranding"
                      type="is-primary"
                    >
                    </b-switch>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">Show PAN Number on Invoice</div>
                <div class="setting-job">
                  <b-field>
                    <b-switch
                      v-model="isSwitchedPan"
                      @input="switchPan"
                      type="is-primary"
                    >
                    </b-switch>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="card">
        <header class="card-header">
          <p class="card-header-title">Printer Settings</p>
        </header>
        <div class="card-content">
          <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">Regular Printer</div>
                <div class="setting-job">
                  <b-field class="print-btn">
                    <b-dropdown
                      expanded
                      :scrollable="isScrollable"
                      :max-height="maxHeight"
                      v-model="currentType"
                      aria-role="list"
                    >
                      <template #trigger>
                        <b-button
                          expanded
                          :label="currentType.text"
                          icon-right="menu-down"
                        />
                      </template>

                      <b-dropdown-item
                        v-for="(menu, index) in types"
                        :key="index"
                        :value="menu"
                        aria-role="listitem"
                      >
                        <div class="media">
                          <div class="media-content">
                            <h3>{{ menu.text }}</h3>
                          </div>
                        </div>
                      </b-dropdown-item>
                    </b-dropdown>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="card">
        <header class="card-header">
          <p class="card-header-title">OTHER</p>
        </header>
        <div class="card-content">
          <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">Show Estimate</div>
                <div class="setting-job">
                  <b-field>
                    <b-switch type="is-primary"> </b-switch>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
          <div class="columns">
            <div class="column is-6">
              <div class="settings-list">
                <div class="setting-name">Other Income</div>
                <div class="setting-job">
                  <b-field>
                    <b-switch type="is-primary"> </b-switch>
                  </b-field>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
    </section>
  </div>
</template>
<script>
import SetModal from "@/components/SetModal";
import TermsModal from "@/components/TermsModal";
export default {
  layout: "settings",
  components: {
    SetModal,
    TermsModal,
  },
  data() {
    return {
      isModalActive: false,
      isModalActive2: false,
      isScrollable: false,
      isSwitched: true,
      isSwitchedLogo: true,
      isSwitchedEmail: false,
      isSwitchedPhone: true,
      isSwitchedAddress: true,
      isSwitchedSignature: true,
      isSwitchedBranding: true,
      isSwitchedBanks: false,
      isSwitchedPan: true,
      maxHeight: 200,
      currentType: { text: "A4" },
      types: [{ text: "A4" }, { text: "A5" }],
    };
  },
  mounted() {
    if (localStorage.getItem("switchDiscount")) {
      this.isSwitched = localStorage.getItem("switchDiscount");
    }
    if (localStorage.getItem("logoStatus")) {
      this.isSwitchedLogo = localStorage.getItem("logoStatus");
    }
    if (localStorage.getItem("switchPhone")) {
      this.isSwitchedPhone = localStorage.getItem("switchPhone");
    }
    if (localStorage.getItem("switchAddress")) {
      this.isSwitchedAddress = localStorage.getItem("switchAddress");
    }
    if (localStorage.getItem("switchSignature")) {
      this.isSwitchedSignature = localStorage.getItem("switchSignature");
    }
    if (localStorage.getItem("switchBranding")) {
      this.isSwitchedBranding = localStorage.getItem("switchBranding");
    }
    if (localStorage.getItem("switchEmail")) {
      this.isSwitchedEmail = localStorage.getItem("switchEmail");
    }
    if (localStorage.getItem("switchBanks")) {
      this.isSwitchedBanks = localStorage.getItem("switchBanks");
    }
    if (localStorage.getItem("switchPan")) {
      this.isSwitchedPan = localStorage.getItem("switchPan");
    }
  },
  methods: {
    logoStatus() {
      localStorage.setItem("logoStatus", this.isSwitchedLogo);
    },
    discountStatus() {
      localStorage.setItem("switchDiscount", this.isSwitched);
    },
    switchPhone() {
      localStorage.setItem("switchPhone", this.isSwitchedPhone);
    },
    switchAddress() {
      localStorage.setItem("switchAddress", this.isSwitchedAddress);
    },
    switchSignature() {
      localStorage.setItem("switchSignature", this.isSwitchedSignature);
    },
    switchBranding() {
      localStorage.setItem("switchBranding", this.isSwitchedBranding);
    },
    switchEmail() {
      localStorage.setItem("switchEmail", this.isSwitchedEmail);
    },
    switchBanks() {
      localStorage.setItem("switchBanks", this.isSwitchedBanks);
    },
    switchPan() {
      localStorage.setItem("switchPan", this.isSwitchedPan);
    },
    trashModal() {
      this.isModalActive = true;
    },
    trashConfirm(a) {
      this.isModalActive = false;
      this.$buefy.snackbar.open({
        message: "Confirmed",
        queue: false,
      });
    },
    trashCancel() {
      this.isModalActive = false;
    },
    trashModal2() {
      this.isModalActive2 = true;
    },
    trashConfirm2() {
      this.isModalActive2 = false;
    },
    trashCancel2() {
      this.isModalActive2 = false;
    },
  },
  head() {
    return {
      title: "Invoice Settings - Karobar",
    };
  },
};
</script>
<style lang="scss">
$green: #3ab98d;
.is-elastic {
  display: none !important;
}
.switch input[type="checkbox"]:checked + .check.is-primary {
  background: $green;
}
.switch:hover input[type="checkbox"]:checked + .check.is-primary {
  background: $green;
}
.invoice-settings {
  .input {
    height: 2.5em;
    border-color: #dedede;
    &:hover {
      border-color: #dedede;
    }
    &:focus {
      border-color: #dedede;
    }
  }
  a.dropdown-item {
    font-size: 16px;
  }
  ::-webkit-input-placeholder {
    color: #676767;
    font-size: 15px;
  }

  .card {
    border-radius: 0;
    border: 1px solid #dbdbdb;
    .card-header {
      background-color: #fafafa;
      padding: 0;
      .card-header-title {
        text-transform: uppercase;
        padding: 1rem 2rem;
      }
    }
    .card-content {
      padding: 1.5rem 2rem;
      .settings-list {
        display: flex;
        justify-content: space-between;
        .setting-job {
          width: 2rem;
          text-align: left;
          & > span {
            cursor: pointer;
            color: $green;
            a {
              color: $green;
              &:hover {
                color: $green;
              }
            }
          }
          // .switch {
          //   margin-right: -1rem;
          //   input[type="checkbox"] + .check {
          //     height: 0.575em;
          //     padding: 0;
          //     width: 2.3em;
          //     background: whitesmoke;
          //   }
          //   input[type="checkbox"] + .check:before {
          //     background: #b5b5b5;
          //   }
          //   &:hover input[type="checkbox"]:checked + .check {
          //     background: $green;
          //   }
          // }
          // .switch input[type="checkbox"]:checked + .check {
          //   background: $green;
          // }
          .print-btn {
            width: 4rem;
            .dropdown-content {
              width: max-content;
            }
            .button {
              box-shadow: none;

              &:focus {
                box-shadow: none;
                border: 1px solid #dedede;
              }
              &:hover {
                background-color: white;
                border: 1px solid #dedede;
              }
            }
          }
        }
      }
    }
  }
  .card:not(:last-child) {
    margin-bottom: 0;
    border-bottom: 0;
  }
}
</style>