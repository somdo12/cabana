import axios from "axios";


export const UploadImageIntoServer = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await axios.post(
            `http://${window.location.hostname}:5000/v1/upload/image/local`,
            formData,
            {
                headers: {
                    'x_z_token': 'test',
                }
            }
        );

        console.log('response : ', response.data);

        return response;
    } catch (error) {
        console.error(error);
    }
}