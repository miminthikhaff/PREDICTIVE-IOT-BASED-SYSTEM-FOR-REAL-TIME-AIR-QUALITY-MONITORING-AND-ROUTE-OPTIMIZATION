import heapq

# def create_graph():
#     graph = {
#         'A': [('B', 5), ('C', 1)],
#         'B': [('A', 5), ('C', 2), ('D', 1)],
#         'C': [('A', 1), ('B', 2), ('D', 4), ('E', 8)],
#         'D': [('B', 1), ('C', 4), ('E', 3), ('F', 6)],
#         'E': [('C', 8), ('D', 3)],
#         'F': [('D', 6)]
#     }
#     return graph

def dijkstra(graph, start, end):
    distances = {node: float('infinity') for node in graph}
    distances[start] = 0
    previous = {node: None for node in graph}

    pq = [(0, start)]

    while pq:
        current_dist, current_node = heapq.heappop(pq)

        if current_dist > distances[current_node]:
            continue

        if current_node == end:
            break

        for neighbor, weight in graph[current_node]:
            distance = current_dist + weight
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                previous[neighbor] = current_node
                heapq.heappush(pq, (distance, neighbor))

    return distances, previous

def shortest_path(previous, start, end):
    path = []
    node = end
    while node is not None:
        path.append(node)
        node = previous[node]
    path.reverse()
    return path



def find_shortest_path(graph, start, end):
    distances, previous = dijkstra(graph, start, end)
    path = shortest_path(previous, start, end)
    return path


# graph = {
#     'A': [('B', 5), ('C', 1)],
#     'B': [('A', 5), ('C', 2), ('D', 1)],
#     'C': [('A', 1), ('B', 2), ('D', 4), ('E', 8)],
#     'D': [('B', 1), ('C', 4), ('E', 3), ('F', 6)],
#     'E': [('C', 8), ('D', 3)],
#     'F': [('D', 6)]
# }

# start = 'A'
# end = 'F'

# path = find_shortest_path(graph, start, end)
# print(path)


    # 'A': [('B', 5), ('C', 1)],
    # 'B': [('A', 5), ('C', 2), ('D', 1)],
    # 'C': [('A', 1), ('B', 2), ('D', 4), ('E', 8)],
    # 'D': [('B', 1), ('C', 4), ('E', 3), ('F', 6)],
    # 'E': [('C', 8), ('D', 3)],
    # 'F': [('D', 6)]
