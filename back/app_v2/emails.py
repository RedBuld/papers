import smtplib
import os

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


async def send_confirmation_email(user):

    msg = MIMEMultipart('alternative')
    msg['Subject'] = "Код подтверждения"
    msg['From'] = 'noreply@oko.grampus-studio.ru'
    msg['To'] = user.email

    txt_template_f = open(os.path.dirname(__file__) + '/templates/confirmation_code.txt')
    txt_template = txt_template_f.read()
    txt_template_f.close()
    html_template_f = open(os.path.dirname(__file__) + '/templates/confirmation_code.html')
    html_template = html_template_f.read()
    html_template_f.close()

    part1 = MIMEText(txt_template.replace('{{activation_code}}', str(user.activation_code)), 'plain')
    part2 = MIMEText(html_template.replace('{{activation_code}}', str(user.activation_code)), 'html')

    msg.attach(part1)
    msg.attach(part2)

    s = smtplib.SMTP('localhost')
    s.sendmail(msg['From'], user.email, msg.as_string())
    s.quit()


async def send_reset_password_email(user):

    msg = MIMEMultipart('alternative')
    msg['Subject'] = "Сброс пароля"
    msg['From'] = 'noreply@oko.grampus-studio.ru'
    msg['To'] = user.email

    txt_template_f = open(os.path.dirname(__file__) + '/templates/reset_password_email.txt')
    txt_template = txt_template_f.read()
    txt_template_f.close()
    html_template_f = open(os.path.dirname(__file__) + '/templates/reset_password_email.html')
    html_template = html_template_f.read()
    html_template_f.close()

    part1 = MIMEText(txt_template.replace('{{activation_code}}', str(user.activation_code)), 'plain')
    part2 = MIMEText(html_template.replace('{{activation_code}}', str(user.activation_code)), 'html')

    msg.attach(part1)
    msg.attach(part2)

    s = smtplib.SMTP('localhost')
    s.sendmail(msg['From'], user.email, msg.as_string())
    s.quit()