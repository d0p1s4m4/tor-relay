;; -*-scheme-*-

(use-modules (gnu)
             (guix modules))
(use-service-modules networking web mcron)
(use-package-modules tor web bootloaders)

(define update-stats
  #~(job "*/15 * * * *"
		 "ls"))

(define (relay-vm name)
  (operating-system
   (host-name (string-append name ".tor.d0p1.eu"))
   (timezone "Europe/Paris")
   (locale "en_US.utf8")
   (hosts-file
    (plain-file "hosts"
				(string-append (local-host-aliases host-name))))
   
   (bootloader (bootloader-configuration
				(bootloader grub-bootloader)
				(targets '("/dev/sda"))))

   (kernel-arguments (list "console=ttyS0,115200"))
   
   (file-systems
    (cons*
     (file-system
      (mount-point "/")
      (device "/dev/sda1")
      (type "ext4"))
     %base-file-systems))
   
   (users %base-user-accounts)
   
   (packages
    (cons* tor nginx
		   %base-packages))
   (services
    (cons*
     (service dhcp-client-service-type)
     (service tor-service-type (tor-configuration
								(config-file (plain-file "relay-config" ""))))
     (service nginx-service-type
              (nginx-configuration
			   (server-blocks
				(list (nginx-server-configuration
					   (listen '("80" "[::]:80"))
					   (server-name '("hello"))
					   (root (local-file "www" #:recursive? #t)))))))
     %base-services))))

(relay-vm "harlock")
