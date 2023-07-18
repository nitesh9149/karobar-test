
export default async function ({ $auth, redirect }) {
    try {

        if (localStorage.getItem('role')) {
            let role = localStorage.getItem('role')
            if (role != 'admin') {
                redirect('/')
            }
            else {
                if ($auth.user.package != "2") {
                    redirect('/renewSubscription')
                }
            }

        }
    } catch (err) {

    }
}