import { runInAction, makeAutoObservable } from "mobx";
import { mainApi } from "../utils/Api";

class DataStore {
  itemsArr = [];

  currentPage = 1;

  totalItems = 0;

  pageSize = 50;

  pageSizeOptions = [5, 10, 15, 20, 25, 50, 100];

  loadingState = "pending";

  constructor() {
    makeAutoObservable(this);
  }

  setLoadingState = (newState) => {
    runInAction(() => {
      this.loadingState = newState;
    });
  };

  setCurrentPage = async (newPage) => {
    await this.getItemsData();
    runInAction(() => {
      this.currentPage = newPage;
    });
  };

  onShowSizeChange = (event, limit) => {
    runInAction(() => {
      this.pageSize = limit;
    });
  };

  getTotalItems = async () => {
    try {
      const { result } = await mainApi.getIds();
      runInAction(() => {
        this.totalItems = result.length;
      });
    } catch (error) {
      console.log(error);
    }
  };

  getItemsData = async () => {
    runInAction(() => {
      this.itemsArr = [];
    });
    this.setLoadingState("loading");
    const req = {
      offset: this.currentPage * this.pageSize,
      limit: this.pageSize,
    };
    try {
      const { result: itemIds } = await mainApi.getIds(req);
      const { result: items } = await mainApi.getItems(itemIds);
      const newItems = [];
      items.reduce((acc, curr) => {
        if (!acc[curr.id]) newItems.push(curr);
        acc[curr.id] = true;
        return acc;
      }, {});
      runInAction(() => {
        this.itemsArr = newItems;
      });
      this.setLoadingState("done");
    } catch (error) {
      console.log(error);
      this.setLoadingState("error");
    }
  };
}

const dataStore = new DataStore();

export { dataStore };
