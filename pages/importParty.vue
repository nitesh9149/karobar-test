<template>
  <div>
    <file-upload-modal
      :is-active="isModalActive"
      @confirm="trashConfirm"
      @cancel="trashCancel"
      :message="message"
      :submitText="'Go to Parties'"
    />
    <error-upload-modal
      :is-active="isModalActive2"
      @cancel="trashCancel2"
      :errorMessage="errorMessage"
    />
    <section class="section is-title-bar">
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <ul>
              <li>Import Party</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
    <section class="section is-main-section">
      <div class="items-excel-content">
        <div class="excel-sample">
          <p>
            Import parties in bulk from an excel file. Note that your file
            should have same format like the given sample sheet. Download the
            sample sheet file and input your parties details and then upload the
            file.
          </p>
          <figure>
            <p class="bold">Excel Sample</p>
            <img src="@/img/sample2.png" alt="Excel Sample" />
          </figure>
          <a
            href="/Karobar_Parties_Import_Sample.xlsx"
            download
            target="_blank"
            class="button is-light"
            >Download Sample</a
          >
        </div>
        <div class="upload-file">
          <b-field>
            <b-upload
              v-model="file"
              drag-drop
              accept=".xls,.xlsx,.xlsb,.xlsm"
              @change.native="save($event)"
            >
              <section class="section">
                <div class="content has-text-centered">
                  <p>
                    <b-icon icon="cloud-upload-outline" size="is-large">
                    </b-icon>
                  </p>
                  <p>Click to Upload</p>
                </div>
              </section>
            </b-upload>
          </b-field>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import axios from "axios";
import VueHtml2pdf from "vue-html2pdf";
import FileUploadModal from "@/components/FileUploadModal";
import ErrorUploadModal from "@/components/ErrorUploadModal";
export default {
  middleware: "auth-business",
  components: {
    VueHtml2pdf,
    FileUploadModal,
    ErrorUploadModal,
  },
  data() {
    return {
      file: null,
      isModalActive: false,
      isModalActive2: false,
      message: "",
      errorMessage: [],
    };
  },
  methods: {
    async save(event) {
      const loadingComponent = this.$buefy.loading.open();
      let snackbar = this.$buefy.snackbar.open({
        message:
          "Please wait while the file is uploading and is being checked.",
        type: "is-primary",
        position: "is-bottom",
        indefinite: false,
      });
      try {
        let formData = new FormData();
        let id = localStorage.getItem("business");
        formData.append("business", id);
        formData.append("file", this.file);
        let response = await axios.post("/core/import-parties/", formData, {
          headers: {
            Authorization: localStorage.getItem("auth._token.local"),
            "Content-type": "multipart/form-data",
          },
        });
        event.target.value = "";
        snackbar.close();
        if (response.data.errors.length) {
          this.errorMessage = response.data.errors;
          this.errorModal();
        } else {
          this.message = response.data.message;
          this.openModal();
        }
      } catch (err) {
        snackbar.close();
        this.$buefy.snackbar.open({
          message: err.response.data.detail,
          type: "is-primary",
          position: "is-bottom",
          actionText: "Retry",
          indefinite: false,
        });
      }

      loadingComponent.close();
    },
    generateReport() {
      this.$refs.html2Pdf.generatePdf();
    },
    openModal() {
      this.isModalActive = true;
    },
    trashConfirm() {
      this.isModalActive = false;
      this.$router.push("/parties");
    },
    trashCancel() {
      this.isModalActive = false;
    },
    errorModal() {
      this.isModalActive2 = true;
    },
    trashCancel2() {
      this.isModalActive2 = false;
    },
  },
  head() {
    return {
      title: "Import Parties - Karobar",
    };
  },
};
</script>
<style lang="scss" scoped>
$green: #3ab98d;
.items-excel-content {
  display: flex;
  flex-wrap: wrap;
  background-color: white;
  border: 1px solid #dedede;
  .excel-sample {
    padding: 1.5rem;
    width: 50%;
    border-right: 1px solid #dedede;
    p {
      padding-bottom: 1rem;
      &.bold {
        font-weight: 600;
      }
    }
    figure {
      padding-top: 1rem;
      padding-bottom: 2rem;
    }
  }
  .upload-file {
    padding: 1.5rem;
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    .upload {
      .icon {
        color: $green;
      }
    }
  }
}
@media screen and (max-width: 1024px) {
  .items-excel-content {
    flex-wrap: wrap;
    .excel-sample {
      width: 100%;
      .button {
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }
    .upload-file {
      width: 100%;
    }
  }
}
</style>
<style lang="scss">
$green: #3ab98d;
.excel-sample {
  .button {
    padding-left: 4rem;
    padding-right: 4rem;
  }
  .button.is-light {
    border-color: $green;
    color: $green;
    background-color: transparent;
    font-weight: 500;
    &:hover {
      background-color: transparent;
    }
  }
}
.items-excel-content {
  .upload-file {
    .upload .upload-draggable {
      width: 25rem;
    }
    .upload .upload-draggable:hover.is-primary,
    .upload .upload-draggable.is-hovered.is-primary {
      border-color: $green;
      background: #d8f1e85c;
    }
  }
}
@media screen and (max-width: 1024px) {
  .items-excel-content .upload-file .upload .upload-draggable {
    width: auto;
  }
}
</style>