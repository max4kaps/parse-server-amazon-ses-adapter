var AmazonSES = require("amazon-ses-mailer");

module.exports=function(options){

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
    var sendPasswordResetEmail = function({ link, appName, user }) {
        console.log("email action sendPasswordResetEmail from " + mail.to);
       
        const content = '<h2 style="color: lightslategray">Password Reset Email</h2>' +
            '<div>' + user.get('email') + ', to reset your password follow this link <a href="' + link + '">'+ link +'</a></div>';

        return sendMail({
            subject: appName + ' : Password Reset Email',
            html: content,
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
        console.log("email action sendVerificationEmail from " + mail.to);
       
        const content = '<h2 style="color: forestgreen">Email Verification</h2>' +
            '<div>' + user.get('email') + ', to verify your email follow this link <a href="' + link + '">'+ link +'</a></div>';

        return sendMail({
            subject: appName + ' : Email Verification',
            html: content,
            to: user.get('email')
        });

    };


    return {
        sendMail: sendMail,
        sendPasswordResetEmail: sendPasswordResetEmail,
        sendVerificationEmail: sendVerificationEmail
   }
};
