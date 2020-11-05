const LIST = 'community/LIST' as const;
const FILTER = 'community/FILTER' as const;
const SEARCH = 'community/SEARCH' as const;

export interface Recipe {
  recNo: number;
  title: string;
  view: number;
  rate: number;
  mainImg: string;
  comment: number;
  writer: string;
}

interface filterType {
  selected: string;
  clickSelect: number;
}

export const list = (form: Array<Recipe>) => ({ type: LIST, payload: form });
export const filter = (form: filterType) => ({
  type: FILTER,
  payload: form,
});
export const search = (keyword: string) => ({ type: SEARCH, payload: keyword });

type Actions =
  | ReturnType<typeof list>
  | ReturnType<typeof filter>
  | ReturnType<typeof search>;

type CommunityState = {
  recipes: Array<Recipe>;
  selected: string;
  searchKeyword: string;
  searchRecipes: Array<Recipe>;
  clickSelect: number;
};

const initialState: CommunityState = {
  recipes: [
    {
      recNo: 1,
      mainImg:
        'https://image.ajunews.com/content/image/2020/08/09/20200809151032760474.jpg',
      title: '간장계란밥',
      writer: 'kwonsky',
      view: 9,
      rate: 4.5,
      comment: 5,
    },
    {
      recNo: 2,
      mainImg:
        'https://mblogthumb-phinf.pstatic.net/MjAyMDA0MjZfMjgw/MDAxNTg3ODMwODI5NDA5.eKKl-K8aWanYwrwtlJhM6z5etDgCEMSsYsTvFfTXKTUg.2muwFdf6YD7qAKLi0ObSRcEhkTYYRPAAJ4N0Aip6CE8g.JPEG.eett7777/IMG_4527.jpg?type=w800',
      title: '토마토계란볶음',
      writer: 'zeunny',
      view: 3,
      rate: 5,
      comment: 7,
    },
  ],
  searchRecipes: [
    {
      recNo: 1,
      mainImg:
        'https://image.ajunews.com/content/image/2020/08/09/20200809151032760474.jpg',
      title: '간장계란밥',
      writer: 'kwonsky',
      view: 9,
      rate: 4.5,
      comment: 5,
    },
    {
      recNo: 2,
      mainImg:
        'https://mblogthumb-phinf.pstatic.net/MjAyMDA0MjZfMjgw/MDAxNTg3ODMwODI5NDA5.eKKl-K8aWanYwrwtlJhM6z5etDgCEMSsYsTvFfTXKTUg.2muwFdf6YD7qAKLi0ObSRcEhkTYYRPAAJ4N0Aip6CE8g.JPEG.eett7777/IMG_4527.jpg?type=w800',
      title: '토마토계란볶음',
      writer: 'zeunny',
      view: 3,
      rate: 5,
      comment: 7,
    },
  ],
  selected: '업데이트순',
  searchKeyword: '',
  clickSelect: 0,
};

function community(
  state: CommunityState = initialState,
  action: Actions,
): CommunityState {
  const recipes = Object.assign([], state.recipes);
  switch (action.type) {
    case LIST:
      return Object.assign({}, state, {
        recipes: action.payload,
        searchRecipes: action.payload,
      });
    case FILTER:
      var filterRecipeList = Object.assign([], state.searchRecipes);
      if (action.payload.selected === '업데이트순') {
        filterRecipeList.sort(function (a: Recipe, b: Recipe) {
          return b.recNo - a.recNo;
        });
      } else if (action.payload.selected === '평점순') {
        filterRecipeList.sort(function (a: Recipe, b: Recipe) {
          return b.rate - a.rate;
        });
      } else if (action.payload.selected === '조회수순') {
        filterRecipeList.sort(function (a: Recipe, b: Recipe) {
          return b.view - a.view;
        });
      } else {
        // 댓글순
        filterRecipeList.sort(function (a: Recipe, b: Recipe) {
          return b.comment - a.comment;
        });
      }
      return Object.assign({}, state, {
        searchRecipes: filterRecipeList,
        selected: action.payload.selected,
        clickSelect: action.payload.clickSelect,
      });
    case SEARCH:
      var searchRecipeList: Recipe[] = [];
      recipes.map((element: Recipe) => {
        if (element.title.includes(action.payload)) {
          searchRecipeList.push(element);
        }
      });
      return Object.assign({}, state, {
        searchRecipes: searchRecipeList,
        searchKeyword: action.payload,
      });
    default:
      return state;
  }
}

export default community;
