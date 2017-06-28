wifi.eventmon.register(wifi.eventmon.STA_GOT_IP, function(T)

http.get("http://192.168.1.9:3000/api/register/1942035/LIGHT/"..T.IP, nil, function(code, data)
    
  end)

collectgarbage();

tmr.delay(100);
  
led1 = 0
gpio.mode(led1, gpio.OUTPUT)

tmr.alarm(0, 1000, 1, function()

srv=net.createServer(net.TCP)
srv:listen(80,function(conn)
    conn:on("receive", function(client,request)
        local _, _, method, path, vars = string.find(request, "([A-Z]+) (.+)?(.+) HTTP");
        --if(method == nil)then
        --    _, _, method, path = string.find(request, "([A-Z]+) (.+) HTTP");
        --end
        local _GET = {}
        if (vars ~= nil)then
            for k, v in string.gmatch(vars, "(%w+)=(%w+)&*") do
                _GET[k] = v
            end
        end
        
        if(_GET.pin == "ON1")then
              gpio.write(led1, gpio.LOW);
        elseif(_GET.pin == "OFF1")then
              gpio.write(led1, gpio.HIGH);
        end
        
        client:close();
        collectgarbage();
    end)
end)

tmr.stop(0);

end)

 end)

station_cfg={}
station_cfg.ssid="SSID"
station_cfg.pwd="PASSWORD"
wifi.sta.config(station_cfg)