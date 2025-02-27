//TODO: Need to update to ts

import {
   API_INITIAL,
   API_FETCHING,
   API_SUCCESS,
   API_FAILED
} from '@ib/api-constants'
import getData from '@ib/api'
import { ApisauceInstance } from 'apisauce'

import { apiMethods } from '../constants/APIConstants'
import { resStatuses, statusCodes } from '../constants/APIErrorConstants'
import I18n from '../i18n'

import { getAccessToken, getRefreshToken } from './StorageUtils'

export function isAccessTokenExpiredMessage(message: string) {
   const errorResponse = JSON.parse(message)
   let isAccessTokenExpired = false
   try {
      const { status, data } = errorResponse
      const { detail: failureMessage, res_status: resStatus } = data
      // infrastructure errors cases
      if (
         status === statusCodes.badRequestErrorCode &&
         (resStatus === resStatuses.invalidToken ||
            resStatus === resStatuses.invalidUser)
      ) {
         isAccessTokenExpired = true
      } else if (
         status === statusCodes.accessForbiddenErrorCode &&
         failureMessage &&
         resStatus === undefined
      ) {
         isAccessTokenExpired = true
      } else if (
         status === statusCodes.unAuthorizedErrorCode &&
         failureMessage &&
         resStatus === undefined
      ) {
         isAccessTokenExpired = true
      } else if (
         status === statusCodes.accessForbiddenErrorCode &&
         resStatus === resStatuses.notAuthorizedException
      ) {
         isAccessTokenExpired = true
      } else if (
         status === statusCodes.notFoundErrorCode &&
         resStatus === resStatuses.userNotFoundException
      ) {
         isAccessTokenExpired = true
      } else if (
         status === statusCodes.notFoundErrorCode &&
         resStatus === resStatuses.invalidSessionToken
      ) {
         isAccessTokenExpired = true
      }
   } catch (e) {
      console.log('error in check error type', e)
   }

   return {
      isAccessTokenExpired
   }
}

export function getAuthAPIAuthorizationHeaders() {
   return {
      'Content-Type': 'application/json; charset=UTF-8'
   }
}

export const displayApiError = (apiError: any, showAlert = false) => {
   let description = ''
   let errorConstant = ''
   let title: string = I18n.t('common:common.errorViewTitle')
   let errorCode: number = statusCodes.internalServerErrorCode
   if (apiError !== null && apiError !== undefined) {
      try {
         const parsedMessage: any = JSON.parse(apiError)
         let parsedError: any

         if (parsedMessage.data === undefined || parsedMessage.data === null) {
            // To handle case when we are directly returning backend  error message
            parsedError = parsedMessage
         } else {
            // To handle case when we are adding all the requests to backend error message
            parsedError = parsedMessage.data
         }

         if (parsedError !== undefined && parsedError !== null) {
            if (
               parsedError.message &&
               parsedError.message === resStatuses.requestTimedOut
            ) {
               title = I18n.t('common:common.errorViewTitle')
               description = I18n.t('common:common.errorViewDescription')
            }

            if (parsedError.response) {
               try {
                  const response = JSON.parse(parsedError.response)
                  const {
                     title: errorTitle,
                     description: errorDescription
                  } = response
                  title = errorTitle
                  description = errorDescription
               } catch (e) {
                  description = parsedError.response
               }
               errorConstant = parsedError.res_status
            }
            if (parsedError.http_status_code) {
               errorCode = parsedError.http_status_code
               errorConstant = parsedError.res_status
               if (
                  parsedError.http_status_code ===
                  statusCodes.noInternetErrorCode
               ) {
                  title = I18n.t('common:common.connectionLost')
                  description = I18n.t('common:common.internetConnection')
               }
            }
         }
      } catch (e) {
         if (apiError) {
            console.log(apiError)
         }
      }
   }

   if (description === null || description === '') {
      title = I18n.t('common:common.errorViewTitle')
      description = I18n.t('common:common.errorViewDescription')
   }
   if (showAlert) {
      alert(description) // eslint-disable-line
   }
   const apiErrorResponse = {
      errorCode,
      title,
      description,
      errorConstant
   }
   return apiErrorResponse
}

export const getAPIErrorMessage = (apiError: any) => {
   const error = displayApiError(apiError)
   return error.description
}

export function getAuthorizationHeaders() {
   return {
      'Content-Type': 'application/json; charset=UTF-8'
   }
}

export const networkCallWithFetch = async (
   api: any,
   url: string,
   requestObject: Record<string, any>,
   type: any = apiMethods.post
) => {
   const token = localStorage.getItem('pa_token')
   const AppBaseUrl = api.getBaseURL()
   const finalURL = AppBaseUrl + url
   console.log(finalURL)
   const options = {
      headers: {
         // Authorization: `Bearer ${token}`,
         'Content-Type': 'application/json'
      },
      method: type
   }
   if (type === apiMethods.post || type === apiMethods.put) {
      options['body'] = JSON.stringify(requestObject)
   }

   const response = await fetch(finalURL)
   const data = await response.json()
   return data
}

export const networkCallWithApisauce = store => async (
   api: any,
   url: string,
   requestObject: Record<string, any>,
   type: any = apiMethods.post,
   options = {
      getAccessToken
   }
) => {
   api.setHeaders({
      Authorization: `Bearer ${options.getAccessToken()}`
   })
   let response: any = null
   try {
      // NOTE: same api is invocation method is used in AuthApiUtils also. for any modifications update the same there
      response = await getData(api, url, requestObject, type)
   } catch (error) {
      const { message } = error as Error
      const { isAccessTokenExpired } = isAccessTokenExpiredMessage(message)
      //
      if (isAccessTokenExpired) {
         // NOTE: To avoid circular dependencies we are passing store as an argument

         const request = {
            refresh_token: getRefreshToken(),
            access_token: getAccessToken()
         }
         await store.refreshAuthTokensAPI(request)

         api.setHeaders({
            Authorization: `Bearer ${options.getAccessToken()}`
         })
         response = await getData(api, url, requestObject, type)
      } else {
         throw error
      }
   }
   return response
}

export function isAPISuccess(...args) {
   const status = true
   return Array.from(args).reduce(
      (returnStatus, item) =>
         returnStatus && parseInt(item, 10) === API_SUCCESS,
      status
   )
}

export function isAPIFailed(...args) {
   return Array.from(args).indexOf(API_FAILED) !== -1
}

/**
    Takes only network call status of multiple calls and
    returns true if any one of them is in loading condition
  */

export function isAPIFetching(...args) {
   const status = false
   return Array.from(args).reduce(
      (returnStatus, item) =>
         returnStatus || parseInt(item, 10) === API_FETCHING,
      status
   )
}

export function isAPIInitial(...args) {
   const status = false
   const initialStatus = Array.from(args).reduce(
      (returnStatus, item) =>
         returnStatus || parseInt(item, 10) === API_INITIAL,
      status
   )
   return initialStatus
}

export function getLoadingStatus(...args) {
   if (isAPISuccess(...args)) {
      return API_SUCCESS
   } else if (isAPIFailed(...args)) {
      return API_FAILED
   } else if (isAPIFetching(...args)) {
      return API_FETCHING
   } else if (isAPIInitial(...args)) {
      return API_INITIAL
   }
   return API_SUCCESS
}
