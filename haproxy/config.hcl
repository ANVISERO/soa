template {
     source      = "/Users/anvisero/Desktop/ITMO/4course/SOA/labs/soa/haproxy/haproxy.cfg.ctmpl"
     destination = "/opt/homebrew/etc/haproxy.cfg"
     command     = "brew services restart haproxy"
     perms       = 0644

     # Необязательно: интервал обновления. По умолчанию использует long-polling консулом.
     # wait {
     #   min = "5s"
     #   max = "10s"
     # }
   }