import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { SwitchType } from "@/types/responses/switchType";
import type { LinkType } from "@/types/responses/linkType";
import type { HostType } from "@/types/responses/hostType";


import { onMounted, ref, reactive } from "vue";
import { v4 as uuidv4 } from "uuid";
import { defineConfigs } from "v-network-graph";
import { ForceLayout } from "v-network-graph/lib/force-layout";


export default ():any => {
  const nodes = ref({})
  const edges = ref({})
  const hosts = ref<HostType[]>([])

  const configs = reactive(
    defineConfigs({
      view: {
        layoutHandler: new ForceLayout({
          positionFixedByDrag: false,
          positionFixedByClickWithAltKey: true,
          // * The following are the default parameters for the simulation.
          // * You can customize it by uncommenting below.
          // createSimulation: (d3, nodes, edges) => {
          //   const forceLink = d3.forceLink<ForceNodeDatum, ForceEdgeDatum>(edges).id(d => d.id)
          //   return d3
          //     .forceSimulation(nodes)
          //     .force("edge", forceLink.distance(100))
          //     .force("charge", d3.forceManyBody())
          //     .force("collide", d3.forceCollide(50).strength(0.2))
          //     .force("center", d3.forceCenter().strength(0.05))
          //     .alphaMin(0.001)
          // }
        }),
      },
      node: {
        label: {
          visible: false,
        },
      },
    })
  )

  onMounted(async () => {
    // get swithces
    const { data: nodesResponse }: AxiosResponse<SwitchType[]> =
      await axios.get('http://127.0.0.1:8080/v1.0/topology/switches')

    nodes.value = nodesResponse.reduce((obj, i) => {
      const index = `switch-${i.dpid}`
      obj[index] = {
        name: `switch-${i.dpid}`,
        icon: 'https://cdn.iconscout.com/icon/free/png-256/switch-1470433-1244947.png',
      }
      return obj
    }, {})

    // get links
    const { data: edgesResponse }: AxiosResponse<LinkType[]> = await axios.get(
      'http://127.0.0.1:8080/v1.0/topology/links'
    )

    const switchEdges = edgesResponse.reduce((obj, i) => {
      const index = `edge-${uuidv4()}`

      obj[index] = {
        source: `switch-${i.src.dpid}`,
        target: `switch-${i.dst.dpid}`,
      }
      return obj
    }, {})

    // get hosts
    const { data: hostsData }: AxiosResponse<HostType[]> = await axios.get(
      'http://127.0.0.1:8080/v1.0/topology/hosts'
    )

    hostsData.forEach((i: HostType) => {
      nodes.value[`host-${i.mac}`] = {
        name: `host-${i.dpid}`,
        icon: 'https://icons-for-free.com/iconfiles/png/512/desktop+mac+24px-131985225649458044.png',
      }
    })

    const hostEdges = hostsData.reduce((obj, i) => {
      const index = `edge-${uuidv4()}`

      obj[index] = {
        source: `switch-${i.port.dpid}`,
        target: `host-${i.mac}`,
      }
      return obj
    }, {})

    edges.value = { ...switchEdges, ...hostEdges }
  })

  return {
    nodes,
    edges,
    configs
  }
}
