NODE_NAME ?= Harlock
NODE_SUBDOMAIN = $(shell echo -n $(NODE_NAME) | tr A-Z a-z)


REPLACE_CMD = sed -e 's/{NodeName}/$(NODE_NAME)/g' -e 's/{NodeSubDomain}/$(NODE_SUBDOMAIN)/g'

install:
	@ echo "Installing $(NODE_NAME) - $(NODE_SUBDOMAIN).tor.d0p1.eu"
	mkdir -p ${DESTDIR}/etc/tor
	$(REPLACE_CMD) torrc > ${DESTDIR}/etc/tor/torrc

	mkdir -p ${DESTDIR}/var/www/html
	${REPLACE_CMD} www/index.html > ${DESTDIR}/var/www/html/index.html

	@for item in $$(find www/assets -type d) ; do install $${item} -d ${DESTDIR}/var/www/html/$${item#www/} ; done
	@for item in $$(find www/assets -type f) ; do install $${item} ${DESTDIR}/var/www/html/$${item#www/} ; done

	install -D -m +x bin/systemstats ${DESTDIR}/usr/bin/systemstats

	echo "*/15 *  * * *  root ${DESTDIR}/usr/bin/systemstats --load ${DESTDIR}/var/www/html/assets/json/loads.json" >> ${DESTDIR}/etc/crontab
	echo "*/10 *  * * *  root ${DESTDIR}/usr/bin/systemstats --network ${DESTDIR}/var/www/html/assets/json/network.json" >> ${DESTDIR}/etc/crontab
