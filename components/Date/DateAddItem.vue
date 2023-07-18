<template>
    <section>
        <b-field label="As of Date">
            <b-datepicker
                placeholder="Select a date"
                icon="calendar-today"
                :locale="locale"
                editable>
            </b-datepicker>
        </b-field>
    </section>
</template>

<script>
export default {
    data() {
        return {
            locale: undefined // Browser locale
        }
    },
    computed: {
        sampleFormat() {
            const dtf = new Intl.DateTimeFormat(this.locale)
            return dtf.format(new Date(2000, 11, 25, 12))
        }
    }
}
</script>
