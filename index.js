var AmazonSES = require("amazon-ses-mailer");

module.exports=function(options){
    const resetPasswordTemplater = options.resetPasswordTemplater;
    const verifyEmailTemplater = options.verifyEmailTemplater;

   var ses = new AmazonSES(
      options.accessKeyId,
      options.secretAccessKey,
      options.region
   );

   var sendMail=function(mail){
      return new Promise(function(resolve, reject){
         console.log("we try to send email['" + mail.subject + "'] to " + mail.to);
         ses.send({
            from: options.from,
            to: [mail.to],
            subject: mail.subject,
            body: {
               html: mail.html
            }
         }, function(error, data) {

            if (error) {
               reject(error);
            } else {
               resolve(data);
            }
         });
      });
   };


    /**
     * sendMail wrapper to send an email with password reset link
     * The options object would have the parameters link, appName, user
     * @param {Object} options
     * @returns {Promise}
     */
    var sendPasswordResetEmail = async function({ link, appName, user }) {
        console.log("email action sendPasswordResetEmail from " + user.get('email'));

        const template = await resetPasswordTemplater(appName, link, user.get('email'));
        return sendMail({
            subject: template.subject,
            html: template.content,
            to: user.get('email')
        });
    };

    /**
     * sendMail wrapper to send an email with an account verification link
     * The options object would have the parameters link, appName, user
     * @param {Object} options
     * @returns {Promise}
     */
    var sendVerificationEmail = function({ link, appName, user }) {
        console.log("email action sendVerificationEmail from " + user.get('email'));

        const template = await verifyEmailTemplater(appName, link, user.get('email'));
        return sendMail({
            subject: template.subject,
            html: template.content,
            to: user.get('email')
        });
    };


    return {
        sendMail: sendMail,
        sendPasswordResetEmail: sendPasswordResetEmail,
        sendVerificationEmail: sendVerificationEmail
   }
};
