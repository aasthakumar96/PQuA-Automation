
export class ManageSession {
    
    static ifSessionExpired() {
        let expireTime = localStorage.getItem('pquaAuthTokenExpires');
        if(expireTime == null)
            return true;
        else {
            let currentTime = new Date().getTime();
            if(currentTime > expireTime) {
                return true;
            }
            else
                return false;
        }
    }
}