FROM nginx
RUN rm -rf /usr/share/nginx/html/*
COPY dist /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/
EXPOSE 80
VOLUME [/usr/share/nginx/html /etc/nginx]
CMD ["nginx","-g","daemon off;"]