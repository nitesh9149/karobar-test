import axios from 'axios'
export default async function ({ $auth, redirect }) {
    try {
        let user = $auth.user
        if (user.blocked == true) {
            window.location.assign('/blocked')
        }
        if (!user.businesses.length) {
            redirect('/createBusiness')
        }

        if (localStorage.getItem('business')) {
            let i = 0

            user.businesses.forEach((element, index) => {
                if (element.business == JSON.parse(localStorage.getItem('business'))) {
                    i = index;
                }
            });
            let business = user.businesses[i];
            if (business.own_business == true) {
                if (business.package != '2') {
                    window.location.assign('/upgradePlan')
                }
                if (business.expired == true) {
                    redirect('/subscription')
                }
            }
            else {
                if (business.package != "2" || business.expired == true) {
                    redirect('/renewSubscription')
                }
            }

        }
        else if (user.businesses.length > 0) {
            if (!localStorage.getItem('business') || !localStorage.getItem('role')) {
                redirect('/selectBusiness')
            }
        }
        else {
            if (!localStorage.getItem('business')) {
                localStorage.setItem('business', user.businesses[0].business)
                localStorage.setItem('role', user.businesses[0].role)
            }
        }
    } catch (err) {

    }
}