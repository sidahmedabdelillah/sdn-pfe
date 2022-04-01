# PFE SDN CONTROLLER RYU

## topology 

        S1
        /\
       /  \
      /    \
     h1    h2

## lunch 

sudo mn --custom topology1.py --topo mytopo --controller=remote,ip=127.0.0.1,port=6653


ryu run ./ws_topology.py ./simple_switch_13.py ./rest_topology.py  --observe-links


cd gui && yarn dev 

## visual 

![Alt text](./img/1.png?raw=true "Title")
