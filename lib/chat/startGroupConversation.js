const http = require('../util/http.js').func
const getGeneralToken = require('../util/getGeneralToken.js').func

exports.required = ['userIds', 'title']
exports.optional = ['jar']

function startGroupConversation (userIds, chatTitle, jar, token) {
  return new Promise((resolve, reject) => {
    const httpOpt = {
      url: '//chat.roblox.com/v2/start-group-conversation',
      options: {
        method: 'POST',
        jar: jar,
        headers: {
          'X-CSRF-TOKEN': token
        },
        json: {
          participantUserIds: userIds,
          title: chatTitle
        },
        resolveWithFullResponse: true
      }
    }

    return http(httpOpt).then((res) => {
      if (res.statusCode === 200) {
        if (!res.body.resultType === 'Success') {
          reject(new Error(res.body.statusMessage))
        } else {
          resolve(res.body)
        }
      } else {
        let error = 'An unknown error has occurred.'
        if (res.body && res.body.errors) {
          error = res.body.errors.map((e) => e.message).join('\n')
        }
        reject(new Error(error))
      }
    })
  })
}

exports.func = (args) => {
  const jar = args.jar

  return getGeneralToken({ jar: jar }).then((xcsrf) => {
    return startGroupConversation(args.userIds, args.title, jar, xcsrf)
  })
}