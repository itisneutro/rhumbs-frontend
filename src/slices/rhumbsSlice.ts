import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  isPending,
  isRejected,
  type PayloadAction,
} from '@reduxjs/toolkit'
import { isAxiosError } from 'axios'
import { api } from '../api'
import type { PublishRhumbsDto } from '../api/Api'
import * as rhumbsMock from '../modules/rhumbsData'
import { getRhumbsMedia } from '../modules/rhumbsMedia'
import type { RhumbsResponse } from '../modules/rhumbsTypes'
import type { RootState } from '../rhumbsStore'

type RhumbsState = {
  minAzimuth: number
  rhumbsList: RhumbsResponse[]
  rhumbsFeed: RhumbsResponse | null
  rhumbsDraft: RhumbsResponse | null
  loading: boolean
}

type RhumbsThunkConfig = {
  state: RootState
  rejectValue: string
}

type RhumbsFeedRequest = {
  id?: number
  next?: boolean
}

type RhumbsCreateRequest = {
  name: string
  image: File | null
  video: File | null
}

type RhumbsLikeRequest = {
  id: number
  isLiked: 0 | 1
}

const rhumbsInitialState: RhumbsState = {
  minAzimuth: 0,
  rhumbsList: [],
  rhumbsFeed: null,
  rhumbsDraft: null,
  loading: false,
}

export const getRhumbsList = createAsyncThunk<RhumbsResponse[], void, RhumbsThunkConfig>(
  'rhumbs/getRhumbsList',
  async (_, { getState, rejectWithValue }) => {
    const { rhumbs, rhumbsUsers } = getState()

    try {
      const rhumbsResponse = await api.rhumbs.rhumbsControllerList({
        minAzimuth: rhumbs.minAzimuth,
      })
      return rhumbsResponse.data.map(getRhumbsMedia)
    } catch (rhumbsError) {
      if (!rhumbsUsers.isAuthenticated) {
        return rhumbsMock.getRhumbsList(rhumbs.minAzimuth)
      }
      return rejectWithValue(String(rhumbsError))
    }
  },
)

export const getRhumbsFeed = createAsyncThunk<
  RhumbsResponse | null,
  RhumbsFeedRequest,
  RhumbsThunkConfig
>(
  'rhumbs/getRhumbsFeed',
  async ({ id, next }, { getState, rejectWithValue }) => {
    try {
      const rhumbsResponse =
        id === undefined
          ? await api.rhumbs.rhumbsControllerFeed0({ next })
          : await api.rhumbs.rhumbsControllerFeed1(String(id), { next })
      return getRhumbsMedia(rhumbsResponse.data)
    } catch (rhumbsError) {
      if (!getState().rhumbsUsers.isAuthenticated) {
        const rhumbsFeedMock =
          id === undefined || next ? rhumbsMock.getNextRhumbs(id) : rhumbsMock.getRhumbsById(id)
        return rhumbsFeedMock ?? null
      }
      return rejectWithValue(String(rhumbsError))
    }
  },
)

export const getRhumbsDraft = createAsyncThunk<RhumbsResponse | null, void, RhumbsThunkConfig>(
  'rhumbs/getRhumbsDraft',
  async (_, { rejectWithValue }) => {
    try {
      const rhumbsResponse = await api.rhumbs.rhumbsControllerDraft()
      return getRhumbsMedia(rhumbsResponse.data)
    } catch (rhumbsError) {
      if (isAxiosError(rhumbsError) && rhumbsError.response?.status === 404) {
        return null
      }
      return rejectWithValue(String(rhumbsError))
    }
  },
)

export const createRhumbs = createAsyncThunk<
  RhumbsResponse,
  RhumbsCreateRequest,
  RhumbsThunkConfig
>(
  'rhumbs/createRhumbs',
  async ({ name, image, video }, { rejectWithValue }) => {
    try {
      const rhumbsResponse = await api.rhumbs.rhumbsControllerCreate({
        name,
        ...(image === null ? {} : { image }),
        ...(video === null ? {} : { video }),
      })
      return getRhumbsMedia(rhumbsResponse.data)
    } catch (rhumbsError) {
      return rejectWithValue(String(rhumbsError))
    }
  },
)

export const publishRhumbs = createAsyncThunk<RhumbsResponse, PublishRhumbsDto, RhumbsThunkConfig>(
  'rhumbs/publishRhumbs',
  async (rhumbsPublish, { rejectWithValue }) => {
    try {
      const rhumbsResponse = await api.rhumbs.rhumbsControllerPublish(rhumbsPublish)
      return getRhumbsMedia(rhumbsResponse.data)
    } catch (rhumbsError) {
      return rejectWithValue(String(rhumbsError))
    }
  },
)

export const deleteRhumbs = createAsyncThunk<void, number, RhumbsThunkConfig>(
  'rhumbs/deleteRhumbs',
  async (id, { rejectWithValue }) => {
    try {
      await api.rhumbs.rhumbsControllerRemove(id)
    } catch (rhumbsError) {
      return rejectWithValue(String(rhumbsError))
    }
  },
)

export const likeRhumbs = createAsyncThunk<RhumbsResponse, RhumbsLikeRequest, RhumbsThunkConfig>(
  'rhumbs/likeRhumbs',
  async ({ id, isLiked }, { rejectWithValue }) => {
    try {
      const rhumbsResponse = await api.rhumbs.rhumbsControllerLike(id, { isLiked })
      return getRhumbsMedia(rhumbsResponse.data)
    } catch (rhumbsError) {
      return rejectWithValue(String(rhumbsError))
    }
  },
)

const rhumbsThunks = [
  getRhumbsList,
  getRhumbsFeed,
  getRhumbsDraft,
  createRhumbs,
  publishRhumbs,
  deleteRhumbs,
  likeRhumbs,
] as const

const rhumbsSlice = createSlice({
  name: 'rhumbs',
  initialState: rhumbsInitialState,
  reducers: {
    setMinAzimuth: (state, action: PayloadAction<number>) => {
      state.minAzimuth = action.payload
    },
    resetRhumbsFilter: (state) => {
      state.minAzimuth = rhumbsInitialState.minAzimuth
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRhumbsList.fulfilled, (state, action) => {
        state.rhumbsList = action.payload
      })
      .addCase(getRhumbsFeed.fulfilled, (state, action) => {
        state.rhumbsFeed = action.payload
      })
      .addCase(getRhumbsFeed.rejected, (state, action) => {
        if (!action.meta.arg.next) {
          state.rhumbsFeed = null
        }
      })
      .addCase(getRhumbsDraft.fulfilled, (state, action) => {
        state.rhumbsDraft = action.payload
      })
      .addCase(createRhumbs.fulfilled, (state, action) => {
        state.rhumbsDraft = action.payload
      })
      .addCase(publishRhumbs.fulfilled, (state) => {
        state.rhumbsDraft = null
      })
      .addCase(likeRhumbs.fulfilled, (state, action) => {
        state.rhumbsFeed = action.payload
      })
      .addMatcher(isPending(...rhumbsThunks), (state) => {
        state.loading = true
      })
      .addMatcher(isFulfilled(...rhumbsThunks), (state) => {
        state.loading = false
      })
      .addMatcher(isRejected(...rhumbsThunks), (state) => {
        state.loading = false
      })
  },
})

export const { setMinAzimuth, resetRhumbsFilter } = rhumbsSlice.actions
export const rhumbsReducer = rhumbsSlice.reducer
