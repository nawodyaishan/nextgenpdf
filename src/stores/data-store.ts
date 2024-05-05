import { create } from 'zustand';
import { CreateChatResponse, IDataStoreState } from '@/interfaces/i-data-store-state';
import axios from 'axios';
import { apiEndpoints } from '@/constants/ApiEndpointsData';
import { Bounce, toast } from 'react-toastify';

const useDataStore = create<IDataStoreState>((set, _get) => ({
  chatResponse: null,
  isLoading: false,
  createChat: async (payload) => {
    set({ isLoading: true });
    try {
      if (!payload.fileName || !payload.fileKey) {
        toast.error(`Something went wrong with File Upload!`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'dark',
          transition: Bounce,
        });
        set({ isLoading: false });
        return false;
      }
      console.log('🚀 - Create Chat payload', payload);
      const response = await axios.post(apiEndpoints.createChat, payload);
      console.log('🙌🏻 - response data from createChat post call ', response.data);
      if (!response.data) {
        set({ isLoading: false });
        return false;
      }
      set({
        chatResponse: response.data as CreateChatResponse,
        isLoading: false,
      });
      return response.data as CreateChatResponse;
    } catch (error: any) {
      console.error('Error during creating chat using file :', error);
      toast.error(`Error during creating Chat!`, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
        transition: Bounce,
      });
    }
    set({ isLoading: false });
    return false;
  },
}));

export default useDataStore;
