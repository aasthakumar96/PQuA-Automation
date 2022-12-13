import { View, ProgressBar} from '@adobe/react-spectrum';
import SnackbarNotif from './SnackbarNotif';

export class LoaderAndToast {

    static showComponent(showLoader, showToast)
    {
        let subSectionView;
        if(showLoader)
            subSectionView = <View>
                                <ProgressBar label="Loading…" labelPosition="top" isIndeterminate />
                            </View>

        else if(showToast)
            subSectionView = <SnackbarNotif message={this.state.toastMessage} severity={this.state.toastVariant} handler={this.onSnackbarClose}/>

        else
            subSectionView = <></>

    }

}